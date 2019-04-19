import { getSteps, WithConnection } from '@syndesis/api';
import { ConnectionOverview, Integration } from '@syndesis/models';
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

/**
 * @param connectionId - the ID of the connection selected in step 2.1, whose
 * actions should be shown.
 * @param position - the zero-based position for the new step in the integration
 * flow.
 */
export interface ISelectActionRouteParams {
  connectionId: string;
  position: string;
}

/**
 * @param integration - the integration object coming from step 3.index, used to
 * render the IVP.
 * @param connection - the connection object selected in step 3.add.1. Needed
 * to render the IVP.
 */
export interface ISelectActionRouteState {
  connection: ConnectionOverview;
  integration: Integration;
}

/**
 * This page shows the list of actions of a connection containing with a **to**
 * pattern.
 * It's supposed to be used for 3.add.2 of the creation wizard.
 *
 * This component expects some [params]{@link ISelectActionRouteParams} and
 * [state]{@link ISelectActionRouteState} to be properly set in the route
 * object.
 *
 * **Warning:** this component will throw an exception if the route state is
 * undefined.
 *
 * @todo DRY the connection icon code
 */
export class SelectActionPage extends React.Component {
  public render() {
    return (
      <WithRouteData<ISelectActionRouteParams, ISelectActionRouteState>>
        {({ connectionId, position }, { connection, integration }) => {
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
                            addAtIndex={positionAsNumber}
                            addIcon={
                              hasData ? (
                                <img src={data.icon} width={24} height={24} />
                              ) : (
                                <Loader />
                              )
                            }
                            addI18nTitle={
                              hasData
                                ? `${positionAsNumber + 1}. ${
                                    data.connector!.name
                                  }`
                                : `${positionAsNumber + 1}. Start`
                            }
                            addI18nTooltip={
                              hasData
                                ? `${positionAsNumber + 1}. ${data.name}`
                                : 'Start'
                            }
                            addI18nDescription={'Choose an action'}
                          />
                        }
                        content={
                          <IntegrationEditorChooseAction
                            i18nTitle={`${connection.name} - Choose Action`}
                            i18nSubtitle={
                              'Choose an action for the selected connectionName.'
                            }
                          >
                            {data.actionsWithTo
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
                                      href={resolvers.create.configure.addStep.configureAction(
                                        {
                                          actionId: a.id!,
                                          connection,
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
                          integration,
                        })}
                        backHref={resolvers.create.configure.addStep.selectConnection(
                          { position, integration }
                        )}
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
