import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useExport } from "~/hooks/use-export";
import { useImport } from "~/hooks/use-import";
import PopupContainer from "../containers/popup-container";
import CreateSessionForm from "../forms/create-session-form";
import SessionList from "../lists/session-list";
import IconButton from "../ui/icon-button";
import Select from "../ui/select";

export default function HomePopup() {
  const { t, i18n } = useTranslation();
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

  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  }

  return (
    <PopupContainer>
      <header className="flex items-end justify-between">
        <div className="flex flex-col">
          <p>{t("home.welcome")}</p>
          <h2 className="text-2xl font-black underline decoration-red-600 decoration-4">
            {t("home.title")}
          </h2>
        </div>
        <div className="w-full max-w-[9ch]">
          <Select title="Select Language" onChange={handleLanguageChange}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </Select>
        </div>
      </header>
      <section className="flex flex-col gap-6">
        <SessionList />
        <CreateSessionForm />
      </section>
      <footer className="flex gap-4">
        <IconButton
          type="button"
          onClick={handleExportData}
          title={t("home.exportData")}
          className="hover:underline">
          <span className="flex items-center gap-1">
            <ArrowDownToLine aria-hidden className="size-6" />
            {t("home.exportData")}
          </span>
        </IconButton>
        <IconButton
          type="button"
          onClick={() => inputRef.current?.click()}
          title={t("home.importData")}
          className="hover:underline">
          <span className="flex items-center gap-1">
            <ArrowUpToLine aria-hidden className="size-6" />
            {t("home.importData")}
          </span>
        </IconButton>
        <input ref={inputRef} onChange={handleImportData} type="file" hidden />
      </footer>
    </PopupContainer>
  );
}
