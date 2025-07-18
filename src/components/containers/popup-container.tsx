interface Props {
  children: React.ReactNode;
}

export default function PopupContainer({ children }: Readonly<Props>) {
  return (
    <main className="flex w-[350px] flex-col gap-6 p-6 font-geist text-sm">
      {children}
    </main>
  );
}
