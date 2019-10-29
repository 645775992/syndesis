import { useVirtualizationHelpers, useVirtualizations } from '@syndesis/api';
import { Virtualization } from '@syndesis/models';
import {
  IActiveFilter,
  IFilterType,
  ISortType,
  PageSection,
  SimplePageHeader,
  VirtualizationList,
  VirtualizationListItem,
  VirtualizationListSkeleton,
} from '@syndesis/ui';
import { WithListViewToolbarHelpers, WithLoader } from '@syndesis/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext, UIContext } from '../../../app';
import i18n from '../../../i18n';
import { ApiError } from '../../../shared';
import resolvers from '../resolvers';
import { VirtualizationHandlers } from '../shared/VirtualizationHandlers';
import {
  getOdataUrl,
  getPublishingDetails,
} from '../shared/VirtualizationUtils';

function getFilteredAndSortedVirtualizations(
  virtualizations: Virtualization[],
  activeFilters: IActiveFilter[],
  isSortAscending: boolean
) {
  let filteredAndSorted = virtualizations;
  activeFilters.forEach((filter: IActiveFilter) => {
    const valueToLower = filter.value.toLowerCase();
    filteredAndSorted = filteredAndSorted.filter(
      (virtualization: Virtualization) =>
        virtualization.name.toLowerCase().includes(valueToLower)
    );
  });

  filteredAndSorted = filteredAndSorted.sort(
    (thisVirtualization, thatVirtualization) => {
      if (isSortAscending) {
        return thisVirtualization.name.localeCompare(
          thatVirtualization.name
        );
      }

      // sort descending
      return thatVirtualization.name.localeCompare(
        thisVirtualization.name
      );
    }
  );

  return filteredAndSorted;
}

const filterByName = {
  filterType: 'text',
  id: 'name',
  placeholder: i18n.t('shared:filterByNamePlaceholder'),
  title: i18n.t('shared:Name'),
} as IFilterType;

const filterTypes: IFilterType[] = [filterByName];

const sortByName = {
  id: 'name',
  isNumeric: false,
  title: i18n.t('shared:Name'),
} as ISortType;

const sortTypes: ISortType[] = [sortByName];

export function getVirtualizationsHref(baseUrl: string): string {
  return `${baseUrl}`;
}

export const VirtualizationsPage: React.FunctionComponent = () => {
  const appContext = React.useContext(AppContext);
  const { pushNotification } = React.useContext(UIContext);
  const { t } = useTranslation(['data', 'shared']);
  const {
    handleDeleteVirtualization,
    handlePublishVirtualization,
    handleUnpublishVirtualization,
  } = VirtualizationHandlers();
  const { resource: data, hasData, error } = useVirtualizations();
  const { exportVirtualization } = useVirtualizationHelpers();

  const doExport = (virtualizationName: string) => {
    exportVirtualization(virtualizationName).catch((e: any) => {
      // notify user of error
      pushNotification(
        t('exportVirtualizationFailed', {
          details: e.errorMessage || e.message || e,
          name: virtualizationName,
        }),
        'error'
      );
    });
  };

  /**
   *
   * @param virtualization the virtualization whose description is being returned
   * @returns the description truncated at 150 chars if necessary
   */
  const getDescription = (virtualization: Virtualization): string => {
    if (virtualization.description) {
      if (virtualization.description.length > 150) {
        return virtualization.description.substring(0, 150) + ' ...';
      }

      return virtualization.description;
    }

    return '';
  };

  const getUsedByMessage = (integrationNames: string[]): string => {
    if (integrationNames.length === 1) {
      return t('usedByOne');
    }

    return t('usedByMulti', { count: integrationNames.length });
  };

  return appContext.config.datavirt.enabled === 0 ? (
    <SimplePageHeader
      i18nTitle={t('virtualizationsPageTitle')}
      i18nDescription={t('virtualizationsDisabled')}
    />
  ) : (
    <>
      <SimplePageHeader
        i18nTitle={t('virtualizationsPageTitle')}
        i18nDescription={t('virtualizationsPageDescription')}
        isTechPreview={true}
        i18nTechPreview={t('shared:techPreview')}
        techPreviewPopoverHtml={
          <span
            dangerouslySetInnerHTML={{
              __html: t('shared:techPreviewPopoverHtml'),
            }}
          />
        }
      />
      <WithListViewToolbarHelpers
        defaultFilterType={filterByName}
        defaultSortType={sortByName}
      >
        {helpers => {
          const filteredAndSorted = getFilteredAndSortedVirtualizations(
            data,
            helpers.activeFilters,
            helpers.isSortAscending
          );
          return (
            <PageSection variant={'light'} noPadding={true}>
              <WithLoader
                error={error !== false}
                loading={!hasData}
                loaderChildren={<VirtualizationListSkeleton width={800} />}
                errorChildren={<ApiError error={error as Error} />}
              >
                {() => (
                  <VirtualizationList
                    filterTypes={filterTypes}
                    sortTypes={sortTypes}
                    resultsCount={filteredAndSorted.length}
                    {...helpers}
                    i18nCreateDataVirtualization={t('createDataVirtualization')}
                    i18nCreateDataVirtualizationTip={t(
                      'createDataVirtualizationTip'
                    )}
                    i18nEmptyStateInfo={t('emptyStateInfoMessage')}
                    i18nEmptyStateTitle={t('emptyStateTitle')}
                    i18nImport={t('shared:Import')}
                    i18nImportTip={t('importVirtualizationTip')}
                    i18nLinkCreateVirtualization={t('createDataVirtualization')}
                    i18nName={t('shared:Name')}
                    i18nNameFilterPlaceholder={t(
                      'shared:nameFilterPlaceholder'
                    )}
                    i18nResultsCount={t('shared:resultsCount', {
                      count: filteredAndSorted.length,
                    })}
                    linkCreateHRef={resolvers.virtualizations.create()}
                    linkImportHRef={resolvers.virtualizations.import()}
                    hasListData={data.length > 0}
                  >
                    {filteredAndSorted.map(
                      (virtualization: Virtualization, index: number) => {
                        const publishingDetails = getPublishingDetails(
                          appContext.config.consoleUrl,
                          virtualization
                        );
                        return (
                          <VirtualizationListItem
                            key={index}
                            detailsPageLink={resolvers.virtualizations.views.root(
                              { virtualization }
                            )}
                            hasViews={!virtualization.empty}
                            virtualizationName={virtualization.name}
                            virtualizationDescription={getDescription(
                              virtualization
                            )}
                            odataUrl={getOdataUrl(virtualization)}
                            i18nCancelText={t('shared:Cancel')}
                            i18nDelete={t('shared:Delete')}
                            i18nDeleteModalMessage={t('deleteModalMessage', {
                              name: virtualization.name,
                            })}
                            i18nDeleteModalTitle={t('deleteModalTitle')}
                            i18nDraft={t('shared:Draft')}
                            i18nEdit={t('shared:Edit')}
                            i18nEditTip={t('editDataVirtualizationTip')}
                            i18nError={t('shared:Error')}
                            i18nExport={t('shared:Export')}
                            i18nInUseText={getUsedByMessage(
                              virtualization.usedBy
                            )}
                            i18nPublish={t('shared:Publish')}
                            i18nPublished={t('publishedDataVirtualization')}
                            i18nUnpublish={t('shared:Unpublish')}
                            i18nUnpublishModalMessage={t(
                              'unpublishModalMessage',
                              {
                                name: virtualization.name,
                              }
                            )}
                            i18nUnpublishModalTitle={t('unpublishModalTitle')}
                            onDelete={handleDeleteVirtualization}
                            onExport={doExport}
                            onUnpublish={handleUnpublishVirtualization}
                            onPublish={handlePublishVirtualization}
                            currentPublishedState={publishingDetails.state}
                            publishingLogUrl={publishingDetails.logUrl}
                            publishingCurrentStep={publishingDetails.stepNumber}
                            publishingTotalSteps={publishingDetails.stepTotal}
                            publishingStepText={publishingDetails.stepText}
                            i18nPublishInProgress={t('publishInProgress')}
                            i18nUnpublishInProgress={t('unpublishInProgress')}
                            i18nPublishLogUrlText={t('shared:viewLogs')}
                            usedBy={virtualization.usedBy}
                          />
                        );
                      }
                    )}
                  </VirtualizationList>
                )}
              </WithLoader>
            </PageSection>
          );
        }}
      </WithListViewToolbarHelpers>
    </>
  );
};
