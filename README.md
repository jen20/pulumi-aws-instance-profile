# @operator-error/pulumi-aws-instance-profile

_This is a package containing components for use with [Pulumi][pulumi], a tool for provisioning cloud infrastructure 
based on a description written with general purpose programming languages._

This package provides a component named `InstanceProfile`, which can be used to create an IAM Role, with inline policies
defined, and an IAM Instance Profile based on the Role. Unless otherwise specified, the EC2 service is allowed to assume
the created Role.

This is a common combination of IAM resources for granting access (for example) to resources for instances in an 
AutoScaled Service.

## Usage

```typescript
import { InstanceProfile } from "@operator-error/pulumi-aws-instance-profile";

const ip = InstanceProfile.create(`test-ip`, {
    description: "Consul Server",
    path: "/consul/",

    policies: {
        "SelfAssembly-AS": {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Resource: "*",
                    Action: [
                        "autoscaling:DescribeAutoScalingGroups",
                        "autoscaling:DescribeAutoScalingInstances",
                    ],
                },
            ],
        },
        "SelfAssembly-EC2": {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Resource: "*",
                    Action: [
                        "ec2:DescribeAvailabilityZones",
                    ],
                },
            ],
        },
    },
});

export const instanceProfileId = ip.then(x => x.instanceProfileId);
export const roleId = ip.then(x => x.roleId);
```

Running a [`pulumi preview`][pulumipreview] of the above program results in the following:

```
Previewing update of stack 'pulumi-instance-profile-test-dev'
Previewing changes:

     Type                                    Name                                                           Plan       Info
 +   pulumi:pulumi:Stack                     pulumi-instance-profile-test-pulumi-instance-profile-test-dev  create
 +   └─ operator-error:aws:instance-profile  test-ip                                                        create
 +      ├─ aws:iam:Role                      test-ip-role                                                   create
 +      │  ├─ aws:iam:RolePolicy             test-ip-selfassembly-as                                        create
 +      │  └─ aws:iam:RolePolicy             test-ip-selfassembly-ec2                                       create
 +      └─ aws:iam:InstanceProfile           test-ip-instance-profile                                       create

info: 6 changes previewed:
    + 6 resources to create
```

## License

This package is licensed under the [Mozilla Public License, v2.0][mpl2].

## Contributing

Please feel free to open issues or pull requests on GitHub.

[pulumi]: https://pulumi.io
[pulumipreview]: https://pulumi.io/reference/cli/pulumi_preview.html
[mpl2]: https://www.mozilla.org/en-US/MPL/2.0/
