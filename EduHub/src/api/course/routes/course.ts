/**
 * job router
 */

import { factories } from '@strapi/strapi';
export default {
  routes: [
    {
      method: 'GET',
      path: '/instructor/courses',
      handler: 'course.getInstructorCourses',
      config: {
        policies: ['global::is-authenticated'], // Apply the is-authenticated policy
      },
    },
    {
      method: 'POST',
      path: '/courses',
      handler: 'course.create',
      config: {
        auth: {
          enabled: true
        },
        policies: []
      }
    },
    
    {
      method: 'GET',
      path: '/courses',
      handler: 'course.find',
      config: {
        auth: {
          enabled: true
        },
        policies: []
      }
    },
          
    {
      method: 'GET',
      path: '/courses/:id',
      handler: 'course.findOne',
      config: {
        auth: {
          enabled: true
        },
        policies: []
      }
    },

    {
      method: 'PUT',
      path: '/courses/:id',
      handler: 'course.update',
      config: {
        auth: {
          enabled: true
        },
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/courses/:id',
      handler: 'course.delete',
      config: {
        auth: {
          enabled: true
        },
        policies: []
      }
    }
  ]
};
