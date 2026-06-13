/**
 * OpenAPI 3.0.0 Spec Definition for the AI Guidance Counselor API.
 */
export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AI Guidance Counselor API',
    description: 'Backend REST API for the Skill Path Architect / AI Guidance Counselor application. Includes student assessment, career recommendations, AI counseling chatbot, and ML model training endpoints.',
    version: '1.0.0',
    contact: {
      name: 'Development Team',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API Base Path',
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token. (Header: `Authorization: Bearer <token>`)',
      },
      queryAuth: {
        type: 'apiKey',
        in: 'query',
        name: 'token',
        description: 'Fallback authentication token passed as a query parameter (used primarily for EventSource / SSE routes).',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          twoFactorEnabled: { type: 'boolean', example: false },
          assessment: {
            type: 'object',
            properties: {
              scores: {
                type: 'object',
                properties: {
                  language_skills: { type: 'number', example: 4.5 },
                  math_and_logic: { type: 'number', example: 3.8 },
                  spatial_awareness: { type: 'number', example: 4.2 },
                  physical_prowess: { type: 'number', example: 2.5 },
                  musical_ability: { type: 'number', example: 3.0 },
                  collaboration_skills: { type: 'number', example: 4.8 },
                  self_awareness: { type: 'number', example: 4.0 },
                  sustainability_focus: { type: 'number', example: 3.5 },
                },
              },
              predictions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    rank: { type: 'integer', example: 1 },
                    career: { type: 'string', example: 'software-engineer' },
                    confidence: { type: 'number', example: 0.89 },
                  },
                },
              },
              summary: { type: 'string', example: 'Jane shows strong analytical capabilities combined with exceptional collaboration skills.' },
              completedAt: { type: 'string', format: 'date-time', example: '2026-06-13T15:10:00Z' },
            },
          },
          createdAt: { type: 'string', format: 'date-time', example: '2026-06-13T10:00:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-06-13T15:10:00Z' },
        },
      },
      CareerPath: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          code: { type: 'string', example: 'software-engineer' },
          name: { type: 'string', example: 'Software Engineer' },
          summary: { type: 'string', example: 'Design, develop, and maintain software applications.' },
          description: { type: 'string', example: 'Software Engineers analyze user needs, design software solutions, write code, test applications, and collaborate with cross-functional teams.' },
          salaryBand: {
            type: 'object',
            properties: {
              entry: { type: 'number', example: 70000 },
              median: { type: 'number', example: 110000 },
              senior: { type: 'number', example: 160000 },
              currency: { type: 'string', example: 'USD' },
            },
          },
          outlook: { type: 'string', example: 'High growth / high demand' },
          workEnvironment: { type: 'string', example: 'Office-based, remote-friendly, highly collaborative.' },
          intelligences: {
            type: 'array',
            items: { type: 'string' },
            example: ['math_and_logic', 'spatial_awareness'],
          },
          skills: {
            type: 'array',
            items: { type: 'string' },
            example: ['JavaScript', 'Problem Solving', 'System Architecture', 'Git'],
          },
          responsibilities: {
            type: 'array',
            items: { type: 'string' },
            example: ['Write high-quality, maintainable code', 'Conduct code reviews', 'Collaborate with product designers'],
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
          user: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
              name: { type: 'string', example: 'Jane Doe' },
              email: { type: 'string', example: 'jane.doe@example.com' },
            },
          },
          rating: { type: 'integer', example: 5 },
          satisfied: { type: 'boolean', example: true },
          comment: { type: 'string', example: 'The assessment predictions were spot-on! Highly recommend.' },
          predictions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                rank: { type: 'integer', example: 1 },
                career: { type: 'string', example: 'software-engineer' },
                confidence: { type: 'number', example: 0.89 },
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ChatMessage: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109ce' },
          role: { type: 'string', enum: ['user', 'assistant'], example: 'user' },
          content: { type: 'string', example: 'What major should I choose to become a software engineer?' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ChatSession: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
          user: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          title: { type: 'string', example: 'Career exploration: Software Engineering' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ModelExperiment: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d0fe4f5311236168a109cf' },
          runId: { type: 'string', example: 'run_xgboost_1718293902312' },
          algorithm: { type: 'string', example: 'XGBoost' },
          hyperparameters: {
            type: 'object',
            properties: {
              learningRate: { type: 'number', example: 0.1 },
              maxDepth: { type: 'integer', example: 6 },
              nEstimators: { type: 'integer', example: 100 },
            },
          },
          accuracy: { type: 'number', example: 0.875 },
          precision: { type: 'number', example: 0.864 },
          recall: { type: 'number', example: 0.875 },
          f1Score: { type: 'number', example: 0.869 },
          metricsPerClass: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                precision: { type: 'number' },
                recall: { type: 'number' },
                f1: { type: 'number' },
              },
            },
            example: {
              'software-engineer': { precision: 0.9, recall: 0.85, f1: 0.87 },
              'data-scientist': { precision: 0.85, recall: 0.88, f1: 0.86 },
            },
          },
          filePath: { type: 'string', example: 'ai/models/archive/model_run_xgboost_1718293902312.h5' },
          encoderPath: { type: 'string', example: 'ai/models/archive/encoder_run_xgboost_1718293902312.h5' },
          isActive: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      GenericResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Database and server health status',
        description: 'Verify if the API server is operational and can connect to MongoDB.',
        security: [], // No authentication required
        responses: {
          '200': {
            description: 'API is running and database is connected.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'API is running' },
                    timestamp: { type: 'string', format: 'date-time' },
                    database: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'connected' },
                        name: { type: 'string', example: 'ai-guidance-counselor' },
                        expectedName: { type: 'string', example: 'ai-guidance-counselor' },
                        nameMatches: { type: 'boolean', example: true },
                        host: { type: 'string', example: 'localhost' },
                        persistent: { type: 'boolean', example: false },
                        mode: { type: 'string', example: 'in-memory' },
                      },
                    },
                  },
                },
              },
            },
          },
          '503': {
            description: 'Database connection is not ready or failed.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'API is up but database is not ready' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        description: 'Create a new user account with student role.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 50, example: 'Jane Doe' },
                  email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                  password: { type: 'string', minLength: 6, example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User registered successfully' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation errors or email already exists.',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log in user',
        description: 'Authenticate user and receive JWT access/refresh tokens.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login successful' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
                    refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation failed.',
          },
          '401': {
            description: 'Invalid credentials.',
          },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        summary: 'Refresh access token',
        description: 'Obtain a new access and refresh token pair using a valid refresh token.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tokens refreshed successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string', example: 'new_eyJhbGci...' },
                    refreshToken: { type: 'string', example: 'new_eyJhbGci...' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error (missing refresh token).',
          },
          '401': {
            description: 'Invalid or expired refresh token.',
          },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        summary: 'Request password reset code',
        description: 'Sends a 4-digit verification code to the registered email address.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Verification code sent.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Verification code sent to your email' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid email address validation error.',
          },
          '404': {
            description: 'No user registered with this email.',
          },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        summary: 'Reset password',
        description: 'Submits the 4-digit code and the new password to update account access.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'code', 'newPassword'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                  code: { type: 'string', minLength: 4, maxLength: 4, example: '1234' },
                  newPassword: { type: 'string', minLength: 6, example: 'NewPassword123' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset successful.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Password reset successful' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation fails, or invalid/expired verification code.',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Log out current user',
        description: 'Invalidates the refresh token on the user document.',
        responses: {
          '200': {
            description: 'Logout successful.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericResponse' },
              },
            },
          },
          '401': {
            description: 'Access denied. Invalid or missing authentication token.',
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current user profile details',
        description: 'Returns profile parameters matching the authenticated token.',
        responses: {
          '200': {
            description: 'User details retrieved.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthenticated.',
          },
        },
      },
    },
    '/careers': {
      get: {
        summary: 'List and search career paths',
        description: 'Get all career options matching optional query parameters. Accessible publicly.',
        security: [],
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Search substring to filter by career name, skills, or intelligence requirements',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'intelligence',
            in: 'query',
            description: 'Filter by primary associated intelligence dimension (e.g. math_and_logic)',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'List of matching careers.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CareerPath' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/careers/{code}': {
      get: {
        summary: 'Get career by code',
        description: 'Fetch detailed career data using the unique slug identifier.',
        security: [],
        parameters: [
          {
            name: 'code',
            in: 'path',
            required: true,
            description: 'The unique slug code identifier (e.g. software-engineer)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Career path details.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CareerPath' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Career code not found.',
          },
        },
      },
    },
    '/users/me': {
      patch: {
        summary: 'Update own profile',
        description: 'Allows current user to change name, email, or enable 2FA.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 50, example: 'Jane Doe' },
                  email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                  twoFactorEnabled: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profile updated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Profile updated successfully' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid input fields or no updates provided.',
          },
          '401': {
            description: 'Unauthorized.',
          },
        },
      },
    },
    '/users/me/password': {
      patch: {
        summary: 'Change password',
        description: 'Allows current user to update password verifying current state.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'OldPass123!' },
                  newPassword: { type: 'string', minLength: 6, example: 'NewPass123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password changed successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid body, or new password same as current password.',
          },
          '401': {
            description: 'Invalid credentials or unauthorized.',
          },
        },
      },
    },
    '/users/assessment': {
      post: {
        summary: 'Submit evaluation assessment scores',
        description: 'Saves scores for student’s multiple intelligences and invokes the ML service to project matching career predictions.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'language_skills',
                  'math_and_logic',
                  'spatial_awareness',
                  'physical_prowess',
                  'musical_ability',
                  'collaboration_skills',
                  'self_awareness',
                  'sustainability_focus',
                ],
                properties: {
                  language_skills: { type: 'number', minimum: 1, maximum: 5, example: 4.5 },
                  math_and_logic: { type: 'number', minimum: 1, maximum: 5, example: 3.8 },
                  spatial_awareness: { type: 'number', minimum: 1, maximum: 5, example: 4.2 },
                  physical_prowess: { type: 'number', minimum: 1, maximum: 5, example: 2.5 },
                  musical_ability: { type: 'number', minimum: 1, maximum: 5, example: 3.0 },
                  collaboration_skills: { type: 'number', minimum: 1, maximum: 5, example: 4.8 },
                  self_awareness: { type: 'number', minimum: 1, maximum: 5, example: 4.0 },
                  sustainability_focus: { type: 'number', minimum: 1, maximum: 5, example: 3.5 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Assessment saved and predictions calculated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Assessment saved successfully' },
                    data: {
                      type: 'object',
                      properties: {
                        scores: {
                          type: 'object',
                          additionalProperties: { type: 'number' },
                        },
                        predictions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              rank: { type: 'integer' },
                              career: { type: 'string' },
                              confidence: { type: 'number' },
                            },
                          },
                        },
                        summary: { type: 'string' },
                        completedAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation failed (scores not in range 1-5).',
          },
          '401': {
            description: 'Unauthorized.',
          },
        },
      },
      get: {
        summary: 'Get assessment history',
        description: 'Fetch the active assessment details and career predictions for the current user.',
        responses: {
          '200': {
            description: 'Current assessment details.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        scores: { type: 'object' },
                        predictions: { type: 'array', items: { type: 'object' } },
                        summary: { type: 'string' },
                        completedAt: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized.',
          },
          '404': {
            description: 'No assessment completed yet.',
          },
        },
      },
    },
    '/users': {
      get: {
        summary: 'List all users (Admin only)',
        description: 'Returns listing of database users. Restricted to role `admin`.',
        responses: {
          '200': {
            description: 'All users.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user by ID (Admin only)',
        description: 'Fetch details of a single user by their MongoDB object ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Mongo object ID of the user',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User details.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
          '404': { description: 'User not found.' },
        },
      },
      put: {
        summary: 'Update user parameters (Admin only)',
        description: 'Modify username or change role status between user and admin.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Mongo object ID of the user',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Admin User' },
                  role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'User updated successfully' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation fails.' },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
          '404': { description: 'User not found.' },
        },
      },
      delete: {
        summary: 'Delete user account (Admin only)',
        description: 'Permanently deletes user from the database.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Mongo object ID of the user',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericResponse' },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
          '404': { description: 'User not found.' },
        },
      },
    },
    '/reviews/public': {
      get: {
        summary: 'Get public reviews',
        description: 'Fetches high rating (4-5 star) reviews to showcase on the landing page.',
        security: [],
        responses: {
          '200': {
            description: 'Public reviews array.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Review' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/reviews': {
      post: {
        summary: 'Submit satisfaction review',
        description: 'Saves user feedback rating, comment, and current career predictions.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating', 'satisfied'],
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  satisfied: { type: 'boolean', example: true },
                  comment: { type: 'string', maxLength: 1000, example: 'Extremely accurate predictions.' },
                  predictions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        rank: { type: 'integer' },
                        career: { type: 'string' },
                        confidence: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Review submitted.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Review submitted successfully' },
                    data: { $ref: '#/components/schemas/Review' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation fail.' },
          '401': { description: 'Unauthenticated.' },
        },
      },
      get: {
        summary: 'Get all reviews (Admin only)',
        description: 'Returns listing of all reviews submitted by users.',
        responses: {
          '200': {
            description: 'All reviews.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Review' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
        },
      },
    },
    '/reviews/mine': {
      get: {
        summary: 'Get current user reviews',
        description: 'Returns all reviews submitted by the active user.',
        responses: {
          '200': {
            description: 'My reviews list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Review' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized.' },
        },
      },
    },
    '/reviews/{id}': {
      delete: {
        summary: 'Delete review (Admin only)',
        description: 'Allows administrator to delete a review post.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Review object ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Review deleted successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericResponse' },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
          '404': { description: 'Review not found.' },
        },
      },
    },
    '/chat/messages': {
      post: {
        summary: 'Send chatbot message',
        description: 'Submits user query to the LLM/counselor service. If sessionId is omitted, a new chat session is automatically initialized.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['question'],
                properties: {
                  question: { type: 'string', maxLength: 4000, example: 'What career paths use logical abilities and programming?' },
                  sessionId: { type: 'string', description: 'Session Mongo ID (optional)', example: '60d0fe4f5311236168a109cd' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Response generated.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        sessionId: { type: 'string', example: '60d0fe4f5311236168a109cd' },
                        sessionTitle: { type: 'string', example: 'What career paths...' },
                        message: { $ref: '#/components/schemas/ChatMessage' },
                        response: { $ref: '#/components/schemas/ChatMessage' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation fail.' },
          '401': { description: 'Unauthorized.' },
        },
      },
    },
    '/chat/sessions': {
      get: {
        summary: 'List user chat sessions',
        description: 'Get all chat session logs of the logged in user.',
        responses: {
          '200': {
            description: 'Sessions list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ChatSession' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized.' },
        },
      },
    },
    '/chat/sessions/{sessionId}/messages': {
      get: {
        summary: 'Get chat messages in session',
        description: 'Fetches message history within a specific chat session.',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            description: 'Session Mongo ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Messages list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ChatMessage' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized.' },
          '404': { description: 'Session not found.' },
        },
      },
    },
    '/chat/sessions/{sessionId}': {
      delete: {
        summary: 'Delete chat session',
        description: 'Deletes session and all its child message records.',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            description: 'Session Mongo ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Session deleted successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericResponse' },
              },
            },
          },
          '401': { description: 'Unauthorized.' },
          '404': { description: 'Session not found.' },
        },
      },
    },
    '/admin/models': {
      get: {
        summary: 'List training experiments (Admin only)',
        description: 'Get all AI model training records, accuracies, and statuses.',
        responses: {
          '200': {
            description: 'Experiment logs.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ModelExperiment' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
        },
      },
    },
    '/admin/models/train': {
      get: {
        summary: 'Train new ML model (Admin only, SSE Stream)',
        description: 'Launches Python process `ai/train.py` asynchronously to train a new model. Returns results in real-time as a Server-Sent Events (SSE) stream. Authentication can be performed via query parameter `token` or Authorization header.',
        security: [
          { queryAuth: [] },
          { bearerAuth: [] },
        ],
        parameters: [
          {
            name: 'algorithm',
            in: 'query',
            required: false,
            description: 'Algorithm parameter (e.g. XGBoost, Random Forest, SVM, MLP)',
            schema: { type: 'string', default: 'XGBoost' },
          },
          {
            name: 'learningRate',
            in: 'query',
            required: false,
            description: 'Hyperparameter for XGBoost',
            schema: { type: 'number' },
          },
          {
            name: 'maxDepth',
            in: 'query',
            required: false,
            description: 'Hyperparameter for XGBoost / Random Forest',
            schema: { type: 'integer' },
          },
          {
            name: 'nEstimators',
            in: 'query',
            required: false,
            description: 'Hyperparameter for XGBoost / Random Forest',
            schema: { type: 'integer' },
          },
          {
            name: 'cValue',
            in: 'query',
            required: false,
            description: 'Hyperparameter for SVM',
            schema: { type: 'number' },
          },
          {
            name: 'hiddenLayerSizes',
            in: 'query',
            required: false,
            description: 'Hyperparameter for MLP (e.g. `100,50`)',
            schema: { type: 'string' },
          },
          {
            name: 'epochs',
            in: 'query',
            required: false,
            description: 'Hyperparameter for MLP training epochs',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'SSE connection established. Stream sends JSON chunk updates: `{"type": "log" | "error" | "success", "message": "...", "data": ...}`.',
            content: {
              'text/event-stream': {
                schema: { type: 'string' },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
        },
      },
    },
    '/admin/models/promote/{id}': {
      post: {
        summary: 'Activate a model experiment (Admin only)',
        description: 'Sets `isActive: true` on the specific experiment model, promotes it to the primary path, and reloads the active predictor model state.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Experiment database object ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Model promoted and reloaded successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Model promoted and reloaded successfully' },
                    data: { $ref: '#/components/schemas/ModelExperiment' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthenticated.' },
          '403': { description: 'Forbidden. Admin privileges required.' },
          '404': { description: 'Experiment not found.' },
        },
      },
    },
  },
}
