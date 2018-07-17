"use strict";
/*
 * Copyright 2018, James Nugent.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws = require("@pulumi/aws");
const pulumi_1 = require("@pulumi/pulumi");
class InstanceProfile extends pulumi_1.ComponentResource {
    static create(name, inputs, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = new InstanceProfile(name, opts);
            const instanceParent = { parent: instance };
            const baseName = name.toLowerCase();
            const baseResourceName = inputs.description.replace(/\s/g, "");
            let principal = inputs.assumeRolePrincipal;
            if (!principal) {
                principal = { Service: "ec2.amazonaws.com" };
            }
            const role = new aws.iam.Role(`${baseName}-role`, {
                description: `${inputs.description} Role`,
                assumeRolePolicy: JSON.stringify(assumeRolePolicyForPrincipal(principal)),
                name: baseResourceName,
                path: inputs.path,
            }, instanceParent);
            const roleParent = { parent: role };
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
        });
    }
    constructor(name, opts) {
        super("operator-error:aws:instance-profile", name, {}, opts);
    }
}
exports.InstanceProfile = InstanceProfile;
function assumeRolePolicyForPrincipal(principal) {
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
//# sourceMappingURL=index.js.map