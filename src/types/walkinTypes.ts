import { UserRoles } from "@/enums/commons";

export class VerifyPayloadDTO{
    IdentificationNumber: string = '';
    UserRole: UserRoles = UserRoles.STUDENTS;

    constructor(init?: Partial<VerifyPayloadDTO>) {
        Object.assign(this, init);
    }
}
