/**
 * Course controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
  async create(ctx: Context) {
    try {
      // Check for authenticated user
      const user = ctx.state.user;
      if (!user) {
        strapi.log.warn('No authenticated user found');
        return ctx.unauthorized('You must be logged in to create a course');
      }
      strapi.log.debug(`Authenticated user ID: ${user.id}`);

      // Validate request body
      const { data } = ctx.request.body;
      if (!data || typeof data !== 'object') {
        strapi.log.warn('Invalid request body: Missing or invalid "data" object');
        return ctx.badRequest('Request body must contain a "data" object');
      }
      strapi.log.debug('Request body data:', data);

      // Extract and validate fields
      const { title, description, thumbnail, price, category, published_status } = data;
      if (!title || !description) {
        strapi.log.warn('Missing required fields: title or description');
        return ctx.badRequest('Title and description are required');
      }

      // Validate price
      let parsedPrice = 0; // Default as per schema
      if (price !== undefined && price !== null) {
        strapi.log.debug(`Raw price input: ${price} (type: ${typeof price})`);
        const priceAsNumber = Number(price);
        if (isNaN(priceAsNumber)) {
          strapi.log.warn(`Invalid price value: ${price}`);
          return ctx.badRequest('Price must be a valid number');
        }
        parsedPrice = Math.floor(priceAsNumber); // Convert to integer as per schema
        if (parsedPrice < 0) {
          strapi.log.warn(`Negative price value: ${parsedPrice}`);
          return ctx.badRequest('Price cannot be negative');
        }
        strapi.log.debug(`Parsed price: ${parsedPrice}`);
      } else {
        strapi.log.debug('Price not provided, using default: 0');
      }

      // Validate published_status
      const validStatuses = ['draft', 'published'];
      const finalPublishedStatus = validStatuses.includes(published_status) ? published_status : 'draft';
      strapi.log.debug(`Published status: ${finalPublishedStatus}`);

      // Validate category by name
      let categoryId = null;
      if (category) {
        strapi.log.debug(`Validating category name: ${category}`);
        const categoryRecords = await strapi.entityService.findMany('api::category.category', {
          filters: { name: category },
        });
        if (!categoryRecords || categoryRecords.length === 0) {
          strapi.log.warn(`Invalid category name: ${category}`);
          return ctx.badRequest(`Category "${category}" not found`);
        }
        categoryId = categoryRecords[0].id;
        strapi.log.debug(`Category validated: ID ${categoryId}`);
      }

      // Validate thumbnail by filename
      let thumbnailId = null;
      if (thumbnail) {
        strapi.log.debug(`Validating thumbnail filename: ${thumbnail}`);
        const thumbnailRecords = await strapi.entityService.findMany('plugin::upload.file', {
          filters: { name: thumbnail },
        });
        if (!thumbnailRecords || thumbnailRecords.length === 0) {
          strapi.log.warn(`Invalid thumbnail filename: ${thumbnail}`);
          return ctx.badRequest(`Thumbnail "${thumbnail}" not found`);
        }
        thumbnailId = thumbnailRecords[0].id;
        strapi.log.debug(`Thumbnail validated: ID ${thumbnailId}`);
      }

      // Validate instructor
      const instructorRecord = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {});
      if (!instructorRecord) {
        strapi.log.error(`Instructor not found: ID ${user.id}`);
        return ctx.badRequest('Invalid instructor');
      }
      strapi.log.debug(`Instructor validated: ID ${user.id}`);

      // Create the course
      strapi.log.debug('Creating course with data:', {
        title,
        description,
        thumbnail: thumbnailId,
        price: parsedPrice,
        category: categoryId,
        published_status: finalPublishedStatus,
        instructor: user.id,
      });
      const newCourse = await strapi.entityService.create('api::course.course', {
        data: {
          title,
          description,
          thumbnail: thumbnailId,
          price: parsedPrice,
          category: categoryId,
          published_status: finalPublishedStatus,
          instructor: user.id,
        },
      });

      // Populate related fields for response
      strapi.log.debug(`Course created: ID ${newCourse.id}`);
      const populatedCourse = await strapi.entityService.findOne('api::course.course', newCourse.id, {
        populate: ['thumbnail', 'category', 'instructor'],
      });

      ctx.send({
        message: 'Course created successfully',
        course: populatedCourse,
      });
    } catch (error) {
      strapi.log.error('Error creating course:', {
        message: error.message,
        stack: error.stack,
        requestBody: ctx.request.body,
      });
      ctx.internalServerError('An error occurred while creating the course', { details: error.message });
    }
  },

  async getInstructorCourses(ctx: Context) {
    try {
      const instructorId = ctx.state.user?.id;
      if (!instructorId) {
        strapi.log.warn('Unauthorized access: No user ID found in state');
        return ctx.unauthorized('You must be logged in as an instructor');
      }

      // Fetch courses for the instructor
      const courses = await strapi.entityService.findMany('api::course.course', {
        filters: { instructor: instructorId },
        populate: ['thumbnail', 'category', 'modules', 'enrollments'],
      });

      if (!courses || courses.length === 0) {
        strapi.log.info(`No courses found for instructor ID: ${instructorId}`);
        return ctx.notFound('No courses found for this instructor');
      }

      ctx.send({ courses });
    } catch (error) {
      strapi.log.error('Error fetching instructor courses:', error);
      ctx.internalServerError('An error occurred while fetching courses');
    }
  },
}));