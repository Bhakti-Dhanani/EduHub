export default async (policyContext: any, config: any, { strapi }: any) => {
  if (policyContext.state.user) {
    strapi.log.info(`Authenticated user: ${policyContext.state.user.id}`);
    return true;
  }

  strapi.log.warn('Unauthorized access attempt detected. No user found in state.');
  return policyContext.unauthorized('You must be logged in to access this resource.');
};