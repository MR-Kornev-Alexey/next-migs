import type {Customer} from "@/components/dashboard/customer/customers-table";
import {organizationClient} from "@/lib/organizations/organization-client";

export async function fetchAllOrganizations(): Promise<Customer[]> {
  // Здесь должен быть ваш код для получения данных с сервера
  const responseAllOrganizations = await organizationClient.getAllOrganization();
  console.log('responseAllOrganizations - ', responseAllOrganizations)
  return responseAllOrganizations?.data
}
