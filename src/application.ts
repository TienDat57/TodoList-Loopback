import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AuthenticationComponent} from '@loopback/authentication';
import {MyJWTAuthenticationComponent} from './services/jwt-authentication-component';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';

export {ApplicationConfig};

export class TodoAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(MyJWTAuthenticationComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.addSecuritySpec();
  }

  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'TODO API',
        version: '1.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [{jwt: []}],
      servers: [{url: '/'}],
    });
  }
}
