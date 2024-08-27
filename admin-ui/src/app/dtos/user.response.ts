import {ProfileResponse} from "./profile.response";

export class UserResponse {
  id!: number;
  email!: string;
  username!: string;
  enabled!: boolean;
  createBy!: string;
  createdDate!: Date;
  lastModifiedBy!: string;
  lastModifiedDate!: Date;
  profile!: ProfileResponse;
}
