import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section className={`li-card ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <header className={`li-card-header ${className}`.trim()} {...props}>
      {children}
    </header>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`li-card-title ${className}`.trim()} {...props}>
      {children}
    </h2>
  );
}

export function CardSection({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`li-card-section ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`li-card-body ${className}`.trim()} {...props}>
      {children}
    </ul>
  );
}
