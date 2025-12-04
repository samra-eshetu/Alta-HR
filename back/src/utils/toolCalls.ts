import { tool } from "langchain";
import { HasuraService } from "./hasura.service";
import z from "zod";
import { GET_ALL_EMPLOYEE, GET_INDIVIDUAL_EMPLOYEE, SEARCH_ALL_EMPLOYEE } from "./queries";

export const listEmployeesTool = (hasuraService:HasuraService) => tool(
  async ({ offset, limit,order_by }) => {
    const res = await  hasuraService.query(GET_ALL_EMPLOYEE,{offset,limit,order_by})
    console.log("list employees",{res,offset,limit, order_by})
    return JSON.stringify(res.employees)
  },
  {
    name: "listEmployees",
    description: "Return a list of all employees",
    schema: z.object({
      offset: z.number().optional().describe("Offset you want to index"),
      limit: z.number().describe("Maximum number of results to return"),
      order_by: z.array(z.any()).optional().describe("Hasura order_by array, e.g., [{dateOfBirth: asc}]"),
    }),
  }
);

export const getEmployeeInfoTool = (hasuraService:HasuraService) => tool(
  async ({ first_name,last_name,email }) => {
    const variables = {
      first_name: first_name ? `%${first_name}%` : "", 
      last_name: last_name ? `%${last_name}%` : "", 
      email: email??""
    }
    const res = await hasuraService.query(GET_INDIVIDUAL_EMPLOYEE,variables)
    console.log("get employee ",{res, first_name,last_name,email})
    // if(res.employees) return res.employees[0]
    return JSON.stringify(res.employees)
  },
  {
    name: "getEmployee",
    description: "Get Employees Information",
    schema: z.object({
      first_name: z.number().describe("first name"),
      last_name: z.number().describe("last name"),
      email: z.number().describe("email"),
    }),
  }
);
export const searchEmployeeTool = (hasuraService:HasuraService) => tool(
  async (where)=>{
    const res = await hasuraService.query(SEARCH_ALL_EMPLOYEE,{where})

    console.log("search employee ",{res,where})
    // if(res.employees) return res.employees
    return JSON.stringify(res.employees)
  },
  {
    name: "searchEmployee",
    description: "Search Employees in hasura database",
    schema: z.object({
      where: z.any().describe("Hasura 'where' filter object to select employees"),
    }),
  }

);
