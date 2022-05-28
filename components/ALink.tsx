import { CSSProperties, FC } from "react";
import Link, { LinkProps } from "next/link";

const ALink: FC<
  LinkProps & {
    className?: string | undefined;
    style?: CSSProperties | undefined;
  }
> = (props) => {
  const { style = {}, className, ...linkProps } = props;
  return (
    <Link {...linkProps}>
      <a className={className} style={{ ...style, color: "inherit", textDecoration: "inherit" }}>
        {props.children}
      </a>
    </Link>
  );
};

export default ALink;
