/*
 * Copyright 2018, James Nugent.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/.
 */

import * as aws from "@pulumi/aws";
import { ComponentResource, Output, ResourceOptions } from "@pulumi/pulumi";

export interface InstanceProfileInputs {
    description: string;
    path?: string;

    policies: { [name: string]: aws.iam.PolicyDocument };

    assumeRolePrincipal?: aws.iam.Principal;
}

export interface InstanceProfileOutputs {
    roleId: Output<string>;
    instanceProfileId: Output<string>;
}

export class InstanceProfile extends ComponentResource implements InstanceProfileOutputs {
    public roleId: Output<aws.ARN>;
    public instanceProfileId: Output<aws.ARN>;

    public static async create(name: string, inputs: InstanceProfileInputs, opts?: ResourceOptions) {
        const instance = new InstanceProfile(name, opts);
        const instanceParent = {parent: instance};

        const baseName = name.toLowerCase();
        const baseResourceName = inputs.description.replace(/\s/g, "");

        let principal = inputs.assumeRolePrincipal;
        if (!principal) {
            principal = {Service: "ec2.amazonaws.com"};
        }

        const role = new aws.iam.Role(`${baseName}-role`, {
            description: `${inputs.description} Role`,
            assumeRolePolicy: JSON.stringify(assumeRolePolicyForPrincipal(principal)),
            name: baseResourceName,
            path: inputs.path,
        }, instanceParent);
        const roleParent = {parent: role};
        instance.roleId = role.id;

        for (const policyName in inputs.policies) {
            if (!inputs.policies.hasOwnProperty(policyName)) {
                continue;
            }

            const policy = inputs.policies[policyName];

            const policyNameLC = policyName.toLowerCase();

            new aws.iam.RolePolicy(`${baseName}-${policyNameLC}`, {
                name: policyName,
                policy: JSON.stringify(policy),
                role: role.id,
            }, roleParent);
        }

        const instanceProfile = new aws.iam.InstanceProfile(`${baseName}-instance-profile`, {
            name: baseResourceName,
            path: inputs.path,
            role: role,
        }, instanceParent);
        instance.instanceProfileId = instanceProfile.id;

        return instance;
    }

    private constructor(name: string, opts?: ResourceOptions) {
        super("operator-error:aws:instance-profile", name, {}, opts);
    }
}

function assumeRolePolicyForPrincipal(principal: aws.iam.Principal): aws.iam.PolicyDocument {
    return {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "AllowAssumeRole",
                Effect: "Allow",
                Principal: principal,
                Action: "sts:AssumeRole",
            },
        ],
    };
}
