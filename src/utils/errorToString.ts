import { ZodError } from "zod";

interface GraphQLErrorShape {
  message: string;
  extensions?: { code?: string };
}

export default function errorToString(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map(({ path, message }) => `${path[0] ?? ""} ${message}`.trim())
      .join(", ");
  }

  if (
    typeof error === "object" &&
    error !== null &&
    Array.isArray(
      (error as { graphQLErrors: GraphQLErrorShape[] }).graphQLErrors,
    )
  ) {
    const gql = (error as { graphQLErrors: GraphQLErrorShape[] })
      .graphQLErrors as GraphQLErrorShape[];
    return gql.map((e) => e.message).join(", ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  if (error && typeof error === "object" && "error" in error) {
    return String(error.error);
  }

  return String(error);
}
