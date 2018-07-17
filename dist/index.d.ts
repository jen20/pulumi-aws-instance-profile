import * as aws from "@pulumi/aws";
import { ComponentResource, Output, ResourceOptions } from "@pulumi/pulumi";
export interface InstanceProfileInputs {
    description: string;
    path?: string;
    policies: {
        [name: string]: aws.iam.PolicyDocument;
    };
    assumeRolePrincipal?: aws.iam.Principal;
}
export interface InstanceProfileOutputs {
    roleId: Output<string>;
    instanceProfileId: Output<string>;
}
export declare class InstanceProfile extends ComponentResource implements InstanceProfileOutputs {
    roleId: Output<aws.ARN>;
    instanceProfileId: Output<aws.ARN>;
    static create(name: string, inputs: InstanceProfileInputs, opts?: ResourceOptions): Promise<InstanceProfile>;
    private constructor();
}
