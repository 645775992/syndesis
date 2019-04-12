import { WithConnections } from '@syndesis/api';
import { Connection } from '@syndesis/models';
import * as React from 'react';
import { ConnectionsWithToolbar } from '../shared';

function getConnectionHref(connection: Connection) {
  return '#todo';
}

export class ConnectionsPage extends React.Component {
  public render() {
    return (
      <WithConnections>
        {({ data, hasData, error }) => (
          <ConnectionsWithToolbar
            error={error}
            loading={!hasData}
            connections={data.connectionsForDisplay}
            getConnectionHref={getConnectionHref}
          />
        )}
      </WithConnections>
    );
  }
}
