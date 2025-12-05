import { tool } from "langchain";
import { HasuraService } from "./hasura.service";
import z from "zod";
import { GET_ALL_EMPLOYEE, GET_INDIVIDUAL_EMPLOYEE, SEARCH_ALL_EMPLOYEE } from "./queries";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

export const listEmployeesTool = (hasuraService:HasuraService) => tool(
  async ({ offset, limit,order_by,description}, config: LangGraphRunnableConfig ) => {
    console.log("list employees",{offset,limit, order_by})
    config.writer?.(description);
    const res = await  hasuraService.query(GET_ALL_EMPLOYEE,{offset,limit,order_by})
    return JSON.stringify(res.employees)
  },
  {
    name: "listEmployees",
    description: "Return a list of all employees, if limit is not provided default to 5",
    schema: z.object({
      offset: z.number().optional().describe("Offset you want to index"),
      limit: z.number().optional().describe("Maximum number of results to return"),
      order_by: z.array(z.any()).optional().describe("Hasura order_by array, e.g., [{dateOfBirth: asc}]"),
      description: z.string().describe("Describe what you are doing, will be used as log output")
    }),
  }
);

export const getEmployeeInfoTool = (hasuraService:HasuraService) => tool(
  async ({ first_name, last_name, email, description },config:LangGraphRunnableConfig) => {
    const variables = {
      first_name: first_name ? `%${first_name}%` : "", 
      last_name: last_name ? `%${last_name}%` : "", 
      email: email??""
    }
    config.writer?.(description);
    console.log("get employee ",{first_name,last_name,email,description})
    const res = await hasuraService.query(GET_INDIVIDUAL_EMPLOYEE,variables)
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
      description: z.string().describe("Describe what you are doing, will be used as log output")
    }),
  }
);
export const searchEmployeeTool = (hasuraService:HasuraService) => tool(
  async ({where,description}, config:LangGraphRunnableConfig)=>{
    console.log(where,description)
    config.writer?.(description);
    const res = await hasuraService.query(SEARCH_ALL_EMPLOYEE,{where})
    console.log(res)
    // if(res.employees) return res.employees
    return JSON.stringify(res.employees)
  },
  {
    name: "searchEmployee",
    description: `
      Search employees in Hasura. DO NOT add a nested 'where'.
      Always provide a Hasura boolean expression object.
      - Example: { gender: { _eq: 'female' } }
      - Combine conditions with _and / _or
      - Valid operators: _eq, _ilike, _lt, _gt, _and, _or
    `,
    schema: z.object({
      where: z.any().describe("Valid Hasura boolean expression to filter employees"),
      description: z.string().describe("Describe what you are doing, will be used as log output")
    }),
  }

);
