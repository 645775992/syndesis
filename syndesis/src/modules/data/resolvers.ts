/* tslint:disable:object-literal-sort-keys no-empty-interface */
import { RestDataService } from '@syndesis/models';
import { makeResolver, makeResolverNoParams } from '@syndesis/utils';
import routes from './routes';

// TODO: unit test every single one of these resolvers 😫
export default {
  virtualizations: {
    views: makeResolver<{ virtualization: RestDataService }>(
      routes.virtualizations.virtualization.views,
      ({ virtualization }) => ({
        params: {
          virtualizationId: virtualization.keng__id,
        },
        state: {
          virtualization,
        },
      })
    ),
    relationship: makeResolver<{ virtualization: RestDataService }>(
      routes.virtualizations.virtualization.relationship,
      ({ virtualization }) => ({
        params: {
          virtualizationId: virtualization.keng__id,
        },
        state: {
          virtualization,
        },
      })
    ),
    sqlQuery: makeResolver<{ virtualization: RestDataService }>(
      routes.virtualizations.virtualization.sqlQuery,
      ({ virtualization }) => ({
        params: {
          virtualizationId: virtualization.keng__id,
        },
        state: {
          virtualization,
        },
      })
    ),
    metrics: makeResolver<{ virtualization: RestDataService }>(
      routes.virtualizations.virtualization.metrics,
      ({ virtualization }) => ({
        params: {
          virtualizationId: virtualization.keng__id,
        },
        state: {
          virtualization,
        },
      })
    ),
    create: makeResolverNoParams(routes.virtualizations.create),
    import: makeResolverNoParams(routes.virtualizations.import),
    list: makeResolverNoParams(routes.virtualizations.list),
  },
  root: makeResolverNoParams(routes.virtualizations.list),
};
