import { medusa } from "./medusa"

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export async function registerCustomer(
  data: RegisterInput
) {
  // Create authentication identity
  await medusa.auth.register("customer", "emailpass", {
    email: data.email,
    password: data.password,
  })

  // Create customer profile
  await medusa.store.customer.create({
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
  })

  // Automatically login
  await medusa.auth.login("customer", "emailpass", {
    email: data.email,
    password: data.password,
  })

  // Return logged in customer
  const { customer } =
    await medusa.store.customer.retrieve()

  return customer
}

export async function loginCustomer(
  data: LoginInput
) {
  await medusa.auth.login("customer", "emailpass", {
    email: data.email,
    password: data.password,
  })

  const { customer } =
    await medusa.store.customer.retrieve()

  return customer
}
export async function getCustomer() {
  try {
    const { customer } =
      await medusa.store.customer.retrieve()

    return customer
  } catch {
    return null
  }
}

export async function logoutCustomer() {
  await medusa.auth.logout()
}
