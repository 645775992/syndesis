// tslint:disable react-unused-props-and-state
// remove the above line after this goes GA https://github.com/Microsoft/tslint-microsoft-contrib/pull/824
import * as H from '@syndesis/history';
import classnames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface IButtonLinkProps {
  onClick?: (e: React.MouseEvent<any>) => void;
  href?: H.LocationDescriptor;
  className?: string;
  disabled?: boolean;
  as?:
    | 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'link';
  size?: 'lg' | 'sm' | 'xs';
  [key: string]: any;
}

export const ButtonLink: React.FunctionComponent<IButtonLinkProps> = ({
  onClick,
  href,
  className,
  disabled,
  as = 'default',
  size,
  children,
  ...props
}) => {
  className = classnames('btn', `btn-${as}`, className, {
    'btn-lg': size === 'lg',
    'btn-sm': size === 'sm',
    'btn-xs': size === 'xs',
  });
  return href && !disabled ? (
    <Link to={href} onClick={onClick} className={className} {...props}>
      {children}
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled || (!onClick && !href)}
    >
      {children}
    </button>
  );
};
