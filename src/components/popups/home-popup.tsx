import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useExport } from "~/hooks/use-export";
import { useImport } from "~/hooks/use-import";
import PopupContainer from "../containers/popup-container";
import CreateSessionForm from "../forms/create-session-form";
import SessionList from "../lists/session-list";

export default function HomePopup() {
  const { t } = useTranslation();
  const { exportDataAsJSON } = useExport();
  const { importDataFromJSON } = useImport();
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleExportData() {
    exportDataAsJSON();
  }

  async function handleImportData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const file = (e.target as FileReader).result;
        if (typeof file !== "string") throw new Error("Invalid JSON");
        importDataFromJSON(file);
      } catch (error) {
        alert("Invalid JSON");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <PopupContainer>
      <header className="flex flex-col">
        <p>{t("home.welcome")}</p>
        <h2 className="text-3xl font-black underline decoration-red-600 decoration-4">
          {t("home.title")}
        </h2>
      </header>
      <section className="flex flex-col gap-6">
        <SessionList />
        <CreateSessionForm />
      </section>
      <footer className="flex gap-2">
        <button
          type="button"
          onClick={handleExportData}
          title={t("home.exportData")}
          className="hover:underline">
          {t("home.exportData")}
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          title={t("home.importData")}
          className="hover:underline">
          {t("home.importData")}
        </button>
        <input ref={inputRef} onChange={handleImportData} type="file" hidden />
      </footer>
    </PopupContainer>
  );
}
