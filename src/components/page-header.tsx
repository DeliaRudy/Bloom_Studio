type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
    </div>
  );
}
