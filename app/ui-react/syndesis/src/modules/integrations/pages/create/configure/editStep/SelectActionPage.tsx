import { getSteps, WithConnection } from '@syndesis/api';
import {
  ButtonLink,
  IntegrationEditorActionsListItem,
  IntegrationEditorChooseAction,
  IntegrationEditorLayout,
  Loader,
} from '@syndesis/ui';
import { WithLoader, WithRouteData } from '@syndesis/utils';
import * as React from 'react';
import { PageTitle } from '../../../../../../shared';
import {
  IntegrationCreatorBreadcrumbs,
  IntegrationEditorSidebar,
} from '../../../../components';
import resolvers from '../../../../resolvers';
import {
  ISelectActionRouteParams,
  ISelectActionRouteState,
} from '../../../editorInterfaces';

/**
 * This page shows the list of actions of a connection containing either a
 * **to** or **from pattern, depending on the specified [position]{@link ISelectActionRouteParams#position}.
 * It's supposed to be used for 3.edit.2 of the creation wizard.
 *
 * This component expects some [params]{@link ISelectActionRouteParams} and
 * [state]{@link ISelectActionRouteState} to be properly set in the route
 * object.
 *
 * **Warning:** this component will throw an exception if the route state is
 * undefined.
 */
export class SelectActionPage extends React.Component {
  public render() {
    return (
      <WithRouteData<ISelectActionRouteParams, ISelectActionRouteState>>
        {({ connectionId, flow, position }, { connection, integration }) => {
          const positionAsNumber = parseInt(position, 10);
          return (
            <WithConnection id={connectionId} initialValue={connection}>
              {({ data, hasData, error }) => (
                <WithLoader
                  error={error}
                  loading={!hasData}
                  loaderChildren={<Loader />}
                  errorChildren={<div>TODO</div>}
                >
                  {() => (
                    <>
                      <PageTitle title={'Choose an action'} />
                      <IntegrationEditorLayout
                        header={<IntegrationCreatorBreadcrumbs step={3} />}
                        sidebar={
                          <IntegrationEditorSidebar
                            steps={getSteps(integration, 0)}
                            activeIndex={positionAsNumber}
                          />
                        }
                        content={
                          <IntegrationEditorChooseAction
                            i18nTitle={`${connection.name} - Choose Action`}
                            i18nSubtitle={
                              'Choose an action for the selected connectionName.'
                            }
                          >
                            {(positionAsNumber > 0
                              ? data.actionsWithTo
                              : data.actionsWithFrom
                            )
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((a, idx) => (
                                <IntegrationEditorActionsListItem
                                  key={idx}
                                  integrationName={a.name}
                                  integrationDescription={
                                    a.description || 'No description available.'
                                  }
                                  actions={
                                    <ButtonLink
                                      href={resolvers.create.configure.editStep.configureAction(
                                        {
                                          actionId: a.id!,
                                          connection,
                                          flow,
                                          integration,
                                          position,
                                        }
                                      )}
                                    >
                                      Select
                                    </ButtonLink>
                                  }
                                />
                              ))}
                          </IntegrationEditorChooseAction>
                        }
                        cancelHref={resolvers.create.configure.index({
                          flow,
                          integration,
                        })}
                      />
                    </>
                  )}
                </WithLoader>
              )}
            </WithConnection>
          );
        }}
      </WithRouteData>
    );
  }
}
