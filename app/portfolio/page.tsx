import { NotebookLayout } from "@/components/notebook-layout";
import { Portfolio } from "@/components/portfolio";

export const metadata = {
  title: "ポートフォリオ",
  description: "@silverbirderのポートフォリオを紹介します",
};

export default function Page() {
  return (
    <NotebookLayout pathname={"/portfolio"}>
      <Portfolio />
    </NotebookLayout>
  );
}
