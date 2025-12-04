export const GET_INDIVIDUAL_EMPLOYEE  = `
query getEmployee($first_name: String, $last_name: String, $email: String) {
  employees(
    where: {
      _or: [
        { first_name: { _ilike: $first_name } },
        { last_name: { _ilike: $last_name } },
        { email: { _eq: $email } }
      ]
    }
  ) {
    first_name
    last_name
    email
  }
}
`
export const GET_ALL_EMPLOYEE  = `
  query getEmployee($limit: Int, $offset: Int) {
    employees(limit: $limit, offset: $offset) {
      first_name
      last_name
      email
      phone
      hire_date
      gender
      national_id
      role_id
      department_id
      date_of_birth
      created_at
      updated_at
    }
  }
`
export const SEARCH_ALL_EMPLOYEE  = `
  query getEmployee($where: any) {
    employees(where: $where) {
      first_name
      last_name
      email
      phone
      hire_date
      gender
      national_id
      role_id
      department_id
      date_of_birth
      created_at
      updated_at
    }
  }
`
