import {
  usePolling,
  useViewDefinitionDescriptors,
  useVirtualization,
  useVirtualizationHelpers,
} from '@syndesis/api';
import {
  Virtualization,
  VirtualizationPublishingDetails,
} from '@syndesis/models';
import {
  PageSection,
  SqlClientContentSkeleton,
  ViewHeaderBreadcrumb,
  VirtualizationDetailsHeader,
} from '@syndesis/ui';
import { useRouteData, WithLoader } from '@syndesis/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext, UIContext } from '../../../app';
import { ApiError } from '../../../shared';
import resolvers from '../../resolvers';
import {
  VirtualizationNavBar,
  WithVirtualizationSqlClientForm,
} from '../shared';
import { VirtualizationHandlers } from '../shared/VirtualizationHandlers';
import {
  getOdataUrl,
  getPublishingDetails,
} from '../shared/VirtualizationUtils';
import './VirtualizationSqlClientPage.css';

/**
 * @param virtualizationId - the ID of the virtualization shown by this page.
 */
export interface IVirtualizationSqlClientPageRouteParams {
  virtualizationId: string;
}

/**
 * @param virtualization - the virtualization being shown by this page. If
 * exists, it must equal to the [virtualizationId]{@link IVirtualizationSqlClientPageRouteParams#virtualizationId}.
 */
export interface IVirtualizationSqlClientPageRouteState {
  virtualization: Virtualization;
}

/**
 * Page displays virtualization views and allows user run test queries against the views.
 */
export const VirtualizationSqlClientPage: React.FunctionComponent = () => {
  const { t } = useTranslation(['data', 'shared']);
  const { params, state, history } = useRouteData<
    IVirtualizationSqlClientPageRouteParams,
    IVirtualizationSqlClientPageRouteState
  >();
  const { resource: virtualization } = useVirtualization(
    params.virtualizationId
  );
  const [description, setDescription] = React.useState(
    state.virtualization.description
  );
  const appContext = React.useContext(AppContext);
  const { pushNotification } = React.useContext(UIContext);
  const {
    exportVirtualization, 
    updateVirtualizationDescription 
  } = useVirtualizationHelpers();
  const {
    handleDeleteVirtualization,
    handlePublishVirtualization,
    handleUnpublishVirtualization,
  } = VirtualizationHandlers();
  const [publishedState, setPublishedState] = React.useState(
    {} as VirtualizationPublishingDetails
  );
  const [usedBy, setUsedBy] = React.useState(state.virtualization.usedBy);

  const {
    resource: viewDefinitionDescriptors,
    error,
    loading,
  } = useViewDefinitionDescriptors(params.virtualizationId);

  const updatePublishedState = async () => {
    const publishedDetails: VirtualizationPublishingDetails = getPublishingDetails(
      appContext.config.consoleUrl,
      virtualization
    ) as VirtualizationPublishingDetails;

    setPublishedState(publishedDetails);
    setUsedBy(virtualization.usedBy);
  };

  // poll to check for updates to the published state
  usePolling({ callback: updatePublishedState, delay: 5000 });

  const getUsedByMessage = (integrationNames: string[]): string => {
    if (integrationNames.length === 1) {
      return t('usedByOne');
    }

    return t('usedByMulti', { count: integrationNames.length });
  };

  const doDelete = async (pVirtualizationId: string): Promise<boolean> => {
    const success = await handleDeleteVirtualization(pVirtualizationId);
    if (success) {
      history.push(resolvers.data.virtualizations.list());
    }
    return success;
  };

  const doExport = () => {
    exportVirtualization(virtualization.name).catch((e: any) => {
      // notify user of error
      pushNotification(
        t('exportVirtualizationFailed', {
          details: e.errorMessage || e.message || e,
          name: virtualization.name,
        }),
        'error'
      );
    });
  }

  const doPublish = async (pVirtualizationId: string, hasViews: boolean) => {
    await handlePublishVirtualization(pVirtualizationId, hasViews);
  };

  const doUnpublish = async (virtualizationName: string) => {
    await handleUnpublishVirtualization(virtualizationName);
  };

  const doSetDescription = async (newDescription: string) => {
    const previous = description;
    setDescription(newDescription); // this sets InlineTextEdit component to new value
    try {
      await updateVirtualizationDescription(
        params.virtualizationId,
        newDescription
      );
      state.virtualization.description = newDescription;
      return true;
    } catch {
      pushNotification(
        t('errorUpdatingDescription', {
          name: state.virtualization.name,
        }),
        'error'
      );
      setDescription(previous); // save failed so set InlineTextEdit back to old value
      return false;
    }
  };

  return (
    <>
      <PageSection variant={'light'} noPadding={true}>
        <ViewHeaderBreadcrumb
          currentPublishedState={publishedState.state}
          virtualizationName={state.virtualization.name}
          dashboardHref={resolvers.dashboard.root()}
          dashboardString={t('shared:Home')}
          dataHref={resolvers.data.root()}
          dataString={t('shared:Virtualizations')}
          i18nCancelText={t('shared:Cancel')}
          i18nDelete={t('shared:Delete')}
          i18nDeleteModalMessage={t('deleteModalMessage', {
            name: state.virtualization.name,
          })}
          i18nDeleteModalTitle={t('deleteModalTitle')}
          i18nExport={t('shared:Export')}
          i18nPublish={t('shared:Publish')}
          i18nResolving={t('virtualization.resolvingPublishState')}
          i18nUnpublish={t('shared:Unpublish')}
          i18nUnpublishModalMessage={t('unpublishModalMessage', {
            name: state.virtualization.name,
          })}
          i18nUnpublishModalTitle={t('unpublishModalTitle')}
          onDelete={doDelete}
          onExport={doExport}
          onUnpublish={doUnpublish}
          onPublish={doPublish}
          hasViews={!state.virtualization.empty}
          usedInIntegration={usedBy.length > 0}
        />
      </PageSection>
      <PageSection
        className={'virtualization-sql-client-page'}
        variant={'light'}
        noPadding={true}
      >
        <VirtualizationDetailsHeader
          i18nDescriptionPlaceholder={t('descriptionPlaceholder')}
          i18nDraft={t('shared:Draft')}
          i18nError={t('shared:Error')}
          i18nInUseText={getUsedByMessage(usedBy)}
          i18nPublished={t('publishedDataVirtualization')}
          i18nPublishInProgress={t('publishInProgress')}
          i18nUnpublishInProgress={t('unpublishInProgress')}
          i18nPublishLogUrlText={t('shared:viewLogs')}
          odataUrl={getOdataUrl(virtualization)}
          publishedState={publishedState.state || 'Loading'}
          publishingCurrentStep={publishedState.stepNumber}
          publishingLogUrl={publishedState.logUrl}
          publishingTotalSteps={publishedState.stepTotal}
          publishingStepText={publishedState.stepText}
          virtualizationDescription={description}
          virtualizationName={state.virtualization.name}
          isWorking={false}
          onChangeDescription={doSetDescription}
        />
      </PageSection>
      <PageSection variant={'light'} noPadding={true}>
        <VirtualizationNavBar virtualization={state.virtualization} />
      </PageSection>
      <PageSection variant={'light'} noPadding={true}>
        <WithLoader
          error={error !== false}
          loading={loading}
          loaderChildren={<SqlClientContentSkeleton />}
          errorChildren={<ApiError error={error as Error} />}
        >
          {() => (
            <WithVirtualizationSqlClientForm
              views={viewDefinitionDescriptors}
              virtualizationId={params.virtualizationId}
              linkCreateView={resolvers.data.virtualizations.create()}
              linkImportViews={resolvers.data.virtualizations.views.importSource.selectConnection(
                { virtualization: state.virtualization }
              )}
            >
              {() => <></>}
            </WithVirtualizationSqlClientForm>
          )}
        </WithLoader>
      </PageSection>
    </>
  );
};
