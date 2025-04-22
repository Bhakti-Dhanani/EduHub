/**
 * category controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
  async find(ctx) {
    try {
      const categories = await strapi.entityService.findMany('api::category.category', {
        filters: {},
        populate: [], // Removed invalid populate field
      });

      ctx.send({
        data: categories,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      ctx.internalServerError('An error occurred while fetching categories');
    }
  },
}));
