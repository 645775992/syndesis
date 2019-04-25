import { Breadcrumb } from '@syndesis/ui';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { WithClosedNavigation } from '../../shared';
import { create } from './pages';
import resolvers from './resolvers';
import routes from './routes';

/**
 * Entry point for the integration creator app. This is shown when an user clicks
 * the "Create integration" button somewhere in the app.
 *
 * Since all the creation routes will show the same breadcrumb and require the
 * left navigation bar to be closed to reclaim space, we do it here.
 *
 * Almost all of the routes *require* some state to be passed for them to
 * properly work, so an url that works for an user *will not work* for another.
 * If you try and open the same url on a different browser, the code will throw
 * an exception because of this.
 *
 * We should set up an error boundary[1] to catch these errors and tell the user
 * that he reached an invalid url, or redirect him to a safe page.
 *
 * [1] https://reactjs.org/docs/error-boundaries.html
 *
 * @todo add an error handler!
 * @todo i18n everywhere!
 */
export class IntegrationCreatorApp extends React.Component {
  public render() {
    return (
      <WithClosedNavigation>
        <Breadcrumb>
          <Link to={resolvers.list()}>Integrations</Link>
          <span>New integration</span>
        </Breadcrumb>
        <Switch>
          {/* step 1.1 */}
          <Route
            path={routes.create.start.selectStep}
            exact={true}
            component={create.start.StartConnectionPage}
          />
          {/* step 1.2 */}
          <Route
            path={routes.create.start.connection.selectAction}
            exact={true}
            component={create.start.StartActionPage}
          />
          {/* step 1.3 */}
          <Route
            path={routes.create.start.connection.configureAction}
            exact={true}
            component={create.start.StartConfigurationPage}
          />
          {/* step 2.1 */}
          <Route
            path={routes.create.finish.selectStep}
            exact={true}
            component={create.finish.FinishConnectionPage}
          />
          {/* step 2.2 */}
          <Route
            path={routes.create.finish.connection.selectAction}
            exact={true}
            component={create.finish.FinishActionPage}
          />
          {/* step 2.3 */}
          <Route
            path={routes.create.finish.connection.configureAction}
            exact={true}
            component={create.finish.FinishConfigurationPage}
          />
          {/* step 3: index */}
          <Route
            path={routes.create.configure.index}
            exact={true}
            component={create.configure.main.AddStepPage}
          />
          {/* step 3: add connection.1 */}
          <Route
            path={routes.create.configure.addStep.selectStep}
            exact={true}
            component={create.configure.addStep.SelectConnectionPage}
          />
          {/* step 3: add connection.2 */}
          <Route
            path={routes.create.configure.addStep.connection.selectAction}
            exact={true}
            component={create.configure.addStep.SelectActionPage}
          />
          {/* step 3: add connection.3 */}
          <Route
            path={routes.create.configure.addStep.connection.configureAction}
            exact={true}
            component={create.configure.addStep.ConfigureActionPage}
          />
          {/* step 3: edit connection.2 (this is optional and can be reached only from the configuration page), must be declared before the configure route */}
          <Route
            path={routes.create.configure.editStep.connection.selectAction}
            exact={true}
            component={create.configure.editStep.SelectActionPage}
          />
          {/* step 3: edit connection.1 (when editing we link directly to the configuration step) */}
          <Route
            path={routes.create.configure.editStep.connection.configureAction}
            exact={true}
            component={create.configure.editStep.ConfigureActionPage}
          />
          {/* step 4 */}
          <Route
            path={routes.create.configure.saveAndPublish}
            exact={true}
            component={create.configure.main.SaveIntegrationPage}
          />
        </Switch>
      </WithClosedNavigation>
    );
  }
}
