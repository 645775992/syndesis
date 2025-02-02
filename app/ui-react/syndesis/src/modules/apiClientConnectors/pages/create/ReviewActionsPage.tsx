import * as H from '@syndesis/history';
import * as React from 'react';

import {
  ApiConnectorCreatorBreadcrumb,
  ApiConnectorCreatorBreadSteps,
  ApiConnectorCreatorFooter,
  ApiConnectorCreatorLayout,
  ApiConnectorCreatorToggleList,
  OpenApiReviewActions,
  PageLoader,
} from '@syndesis/ui';
import { useRouteData, WithLoader } from '@syndesis/utils';
import { ApiError, PageTitle } from '../../../../shared';

import { useApiConnectorSummary } from '@syndesis/api';
import { Translation } from 'react-i18next';
import { UIContext } from '../../../../app';
import { WithLeaveConfirmation } from '../../../../shared/WithLeaveConfirmation';
import { ICreateConnectorProps } from '../../models';
import resolvers from '../../resolvers';
import routes from '../../routes';

export interface IReviewActionsRouteState {
  configured?: ICreateConnectorProps;
  /**
   * connectorTemplateId indicates whether
   * this is a SOAP or REST style web service
   */
  connectorTemplateId?: string;
  specification?: string;
  url?: string;
}

export const ReviewActionsPage: React.FunctionComponent = () => {
  const uiContext = React.useContext(UIContext);
  const { state, history } = useRouteData<null, IReviewActionsRouteState>();

  const { apiSummary, loading, error } = useApiConnectorSummary(
    state.specification,
    state.url,
    state.connectorTemplateId,
    state.configured
  );

  React.useEffect(() => {
    if (error) {
      uiContext.pushNotification((error as Error).message, 'error');
      history.push(resolvers.create.upload());
    }
  }, [error, uiContext, history]);

  return (
    <Translation ns={['apiClientConnectors', 'shared']}>
      {(t) => (
        <WithLeaveConfirmation
          i18nTitle={t('apiClientConnectors:create:unsavedChangesTitle')}
          i18nConfirmationMessage={t(
            'apiClientConnectors:create:unsavedChangesMessage'
          )}
          shouldDisplayDialog={(location: H.LocationDescriptor) => {
            const url =
              typeof location === 'string' ? location : location.pathname!;
            return !url.startsWith(routes.create.root);
          }}
        >
          {() => (
            <WithLoader
              loading={loading}
              loaderChildren={<PageLoader />}
              error={error !== false}
              errorChildren={<ApiError error={error as Error} />}
            >
              {() => (
                <>
                  <PageTitle
                    title={t('apiClientConnectors:create:review:title')}
                  />
                  <ApiConnectorCreatorBreadcrumb
                    cancelHref={resolvers.list()}
                    connectorsHref={resolvers.list()}
                    i18nCancel={t('shared:Cancel')}
                    i18nConnectors={t(
                      'apiClientConnectors:apiConnectorsPageTitle'
                    )}
                    i18nCreateConnection={t(
                      'apiClientConnectors:CreateApiConnector'
                    )}
                  />
                  <ApiConnectorCreatorLayout
                    content={
                      <OpenApiReviewActions
                        i18nApiDefinitionHeading={t(
                          'apiClientConnectors:create:review:sectionApiDefinition'
                        )}
                        i18nDescriptionLabel={t(
                          'apiClientConnectors:create:review:descriptionLabel'
                        )}
                        i18nImportedHeading={t(
                          'apiClientConnectors:create:review:sectionImported'
                        )}
                        i18nNameLabel={t(
                          'apiClientConnectors:create:review:nameLabel'
                        )}
                        apiProviderDescription={apiSummary!.description}
                        apiProviderName={apiSummary!.name}
                        i18nOperationsHtmlMessage={`<strong>${apiSummary?.actionsSummary?.reduce(
                          (sum, summary) => sum + (summary.totalActions || 0),
                          0
                        )}</strong> operations${
                          (apiSummary?.actionsSummary?.length || 0) > 1
                            ? ' in <strong>' +
                              apiSummary?.actionsSummary?.length +
                              '</strong> services'
                            : ''
                        }`}
                        i18nWarningsHeading={t(
                          'apiClientConnectors:create:review:sectionWarnings'
                        )}
                        warningMessages={
                          apiSummary!.warnings
                            ? apiSummary!.warnings!.map(
                                (warning) => (warning as any).message
                              )
                            : undefined
                        }
                        i18nErrorsHeading={t(
                          'apiClientConnectors:review:sectionErrors'
                        )}
                        errorMessages={
                          apiSummary!.errors
                            ? apiSummary!.errors!.map(
                                (e: any) =>
                                  `${e.property ? e.property + ': ' : ''} ${
                                    e.message
                                  }`
                              )
                            : undefined
                        }
                      />
                    }
                    footer={
                      <ApiConnectorCreatorFooter
                        backHref={resolvers.create.upload()}
                        i18nBack={t('shared:Back')}
                        i18nNext={t('shared:Next')}
                        i18nReviewEdit={t(
                          'apiClientConnectors:create:review:btnReviewEdit'
                        )}
                        isNextLoading={false}
                        isNextDisabled={!!apiSummary!.errors}
                        nextHref={
                          state.connectorTemplateId ===
                          'soap-connector-template'
                            ? resolvers.create.servicePort({
                                ...state,
                                apiSummary: apiSummary!,
                                configured: {
                                  ...state.configured,
                                  specification:
                                    apiSummary?.configuredProperties
                                      ?.specification,
                                },
                                specification:
                                  apiSummary?.configuredProperties
                                    ?.specification || state.specification, // if the server returned a different specification use that
                              })
                            : resolvers.create.security({
                                ...state,
                                apiSummary: apiSummary!,
                                configured: {
                                  ...state.configured,
                                  specification:
                                    apiSummary?.configuredProperties
                                      ?.specification,
                                },
                                connectorTemplateId:
                                  'swagger-connector-template',
                                specification:
                                  apiSummary?.configuredProperties
                                    ?.specification || state.specification, // if the server returned a different specification use that
                              })
                        }
                        reviewEditHref={
                          (!state.connectorTemplateId ||
                            state.connectorTemplateId ===
                              'swagger-connector-template') &&
                          apiSummary?.configuredProperties
                            ? resolvers.create.specification({
                                specification:
                                  apiSummary!.configuredProperties!
                                    .specification,
                              })
                            : ''
                        }
                      />
                    }
                    navigation={
                      <ApiConnectorCreatorBreadSteps
                        step={2}
                        i18nConfiguration={t(
                          'apiClientConnectors:create:configuration:title'
                        )}
                        i18nDetails={t(
                          'apiClientConnectors:create:details:title'
                        )}
                        i18nReview={t(
                          'apiClientConnectors:create:review:title'
                        )}
                        i18nSecurity={t(
                          'apiClientConnectors:create:security:title'
                        )}
                        i18nSelectMethod={t(
                          'apiClientConnectors:create:selectMethod:title'
                        )}
                      />
                    }
                    toggle={
                      <ApiConnectorCreatorToggleList
                        step={1}
                        i18nDetails={t(
                          'apiClientConnectors:create:details:title'
                        )}
                        i18nReview={t(
                          'apiClientConnectors:create:review:title'
                        )}
                        i18nSecurity={t(
                          'apiClientConnectors:create:security:title'
                        )}
                        i18nSelectMethod={t(
                          'apiClientConnectors:create:selectMethod:title'
                        )}
                      />
                    }
                  />
                </>
              )}
            </WithLoader>
          )}
        </WithLeaveConfirmation>
      )}
    </Translation>
  );
};
