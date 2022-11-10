// import { inject } from '@loopback/core';
// import { Request, RestBindings, ResponseObject, post } from '@loopback/rest';
// import { CAuthenticate } from './router';

// import {
//   TokenServiceBindings,
//   MyUserService,
//   UserServiceBindings,
//   UserRepository,
// } from '@loopback/authentication-jwt';
// import {TokenService} from '@loopback/authentication';
// import {SecurityBindings, UserProfile} from '@loopback/security';
// import {repository} from '@loopback/repository';

// const AUTHENTICATE : ResponseObject = {
//   description: 'Authenticate Response',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         title: 'AuthenticateResponse',
//         properties: {
//           greeting: {type: 'string'},
//           date: {type: 'string'},
//           url: {type: 'string'},
//           headers: {
//             type: 'object',
//             properties: {
//               'Content-Type': {type: 'string'},
//             },
//             additionalProperties: true,
//           },
//         },
//       },
//     },
//   },
// };

// export class AuthenticateController {
//   constructor(
//     @inject(TokenServiceBindings.TOKEN_SERVICE)
//     public jwtService: TokenService,
//     @inject(UserServiceBindings.USER_SERVICE)
//     public userService: MyUserService,
//     @inject(SecurityBindings.USER, {optional: true})
//     public user: UserProfile,
//     @repository(UserRepository) protected userRepository: UserRepository,
//   ) {}

//   @post(CAuthenticate.LOGIN, {
//     responses: {
//       '200': AUTHENTICATE,
//     },
//   })
//   async login(): Promise<object> {
//     return {
//       greeting: 'Hello from Login',
//       date: new Date(),
//       url: this.req.url,
//       headers: Object.assign({}, this.req.headers),
//     };
//   }

//   @post(CAuthenticate.REGISTER, {
//     responses: {
//       '200': AUTHENTICATE,
//     },
//   })
//   async register(): Promise<object> {
//     return {
//       greeting: 'Hello from register',
//       date: new Date(),
//       url: this.req.url,
//       headers: Object.assign({}, this.req.headers),
//     };
//   }
// }

