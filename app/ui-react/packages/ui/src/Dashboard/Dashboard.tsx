import { Title } from '@patternfly/react-core';
import * as H from 'history';
import { CardGrid, Grid } from 'patternfly-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ButtonLink, Container } from '../Layout';
import './Dashboard.css';

export interface IIntegrationsPageProps {
  linkToIntegrations: H.LocationDescriptor;
  linkToIntegrationCreation: H.LocationDescriptor;
  linkToConnections: H.LocationDescriptor;
  linkToConnectionCreation: H.LocationDescriptor;
  integrationsOverview: JSX.Element;
  connectionsOverview: JSX.Element;
  messagesOverview: JSX.Element;
  uptimeOverview: JSX.Element;
  topIntegrations: JSX.Element;
  integrationBoard: JSX.Element;
  integrationUpdates: JSX.Element;
  connections: JSX.Element;
  i18nConnections: string;
  i18nLinkCreateConnection: string;
  i18nLinkCreateIntegration: string;
  i18nLinkToConnections: string;
  i18nLinkToIntegrations: string;
  i18nTitle: string;
}

export class Dashboard extends React.PureComponent<IIntegrationsPageProps> {
  public render() {
    return (
      <Container>
        <Grid fluid={true}>
          <Grid.Row>
            <Grid.Col sm={12}>
              <div className={'Dashboard-header'}>
                <Title size="lg" className={'Dashboard-header__title'}>
                  {this.props.i18nTitle}
                </Title>
                <div className="Dashboard-header__actions">
                  <ButtonLink href={this.props.linkToIntegrations}>
                    {this.props.i18nLinkToIntegrations}
                  </ButtonLink>
                  <ButtonLink
                    href={this.props.linkToIntegrationCreation}
                    as={'primary'}
                  >
                    {this.props.i18nLinkCreateIntegration}
                  </ButtonLink>
                </div>
              </div>
            </Grid.Col>
          </Grid.Row>
        </Grid>
        <CardGrid fluid={true} matchHeight={true}>
          <CardGrid.Row>
            <CardGrid.Col sm={6} md={3}>
              {this.props.integrationsOverview}
            </CardGrid.Col>
            <CardGrid.Col sm={6} md={3}>
              {this.props.connectionsOverview}
            </CardGrid.Col>
            <CardGrid.Col sm={6} md={3}>
              {this.props.messagesOverview}
            </CardGrid.Col>
            <CardGrid.Col sm={6} md={3}>
              {this.props.uptimeOverview}
            </CardGrid.Col>
          </CardGrid.Row>
        </CardGrid>
        <Grid fluid={true}>
          <Grid.Row>
            <Grid.Col sm={12}>{this.props.topIntegrations}</Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col sm={12} md={6}>
              {this.props.integrationBoard}
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              {this.props.integrationUpdates}
            </Grid.Col>
          </Grid.Row>
        </Grid>
        <Grid fluid={true} style={{ marginTop: '20px' }}>
          <Grid.Row>
            <Grid.Col sm={12}>
              <div className={'Dashboard-header'}>
                <Title size="lg" className={'Dashboard-header__title'}>
                  {this.props.i18nConnections}
                </Title>
                <div className="Dashboard-header__actions">
                  <Link to={this.props.linkToConnections}>
                    {this.props.i18nLinkToConnections}
                  </Link>
                  <ButtonLink
                    href={this.props.linkToConnectionCreation}
                    as={'primary'}
                  >
                    {this.props.i18nLinkCreateConnection}
                  </ButtonLink>
                </div>
              </div>
            </Grid.Col>
          </Grid.Row>
        </Grid>
        <CardGrid fluid={true} matchHeight={true}>
          <CardGrid.Row>{this.props.connections}</CardGrid.Row>
        </CardGrid>
      </Container>
    );
  }
}
