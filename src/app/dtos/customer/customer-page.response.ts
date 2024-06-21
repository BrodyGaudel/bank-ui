import {PaginationInfo} from "../util/pagination-info";
import {PageStatus} from "../util/page-status";
import {CustomerResponse} from "./custmer.response";

export class CustomerPageResponse {
  pagination!: PaginationInfo;
  status!: PageStatus;
  customers!: CustomerResponse[];
}
