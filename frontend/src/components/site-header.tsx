// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import { Button, Separator, SidebarTrigger } from "tentix-ui";

// interface SiteHeaderProps {
//   title?: string;
//   sidebarVisible?: boolean;
//   toggleSidebar?: () => void;
// }

// export function SiteHeader({
//   title = "Work Orders",
//   sidebarVisible,
//   toggleSidebar,
// }: SiteHeaderProps) {
//   return (
//     <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         <h1 className="text-base font-medium max-w-200 truncate block">
//           {title}
//         </h1>

//         {toggleSidebar && (
//           <div className="ml-auto hidden md:block">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 rounded-full bg-background shadow-xs hover:bg-muted"
//               onClick={toggleSidebar}
//               aria-label={sidebarVisible ? "Expand panel" : "Collapse panel"}
//             >
//               {sidebarVisible ? (
//                 <ChevronRightIcon className="h-4 w-4" />
//               ) : (
//                 <ChevronLeftIcon className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "tentix-ui";

interface SiteHeaderProps {
  title?: string;
  onBack?: () => void;
  onSubmit?: () => void;
  submitText?: string;
}

export function SiteHeader({
  title = "Work Orders",
  onBack,
  onSubmit,
  submitText = "Submit",
}: SiteHeaderProps) {
  return (
    <header className="flex h-24 items-center border-b px-8">

      <button
        className="flex items-center justify-center h-8 w-8 mr-4"
        onClick={onBack}
        aria-label="Back"
        type="button"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <h1 className="flex-1 text-2xl font-semibold truncate">{title}</h1>

      <Button
        className="ml-4 bg-black w-28 h-10 rounded-lg px-4 py-2"
        onClick={onSubmit}
        type="button"
      >
        {submitText}
      </Button>
    </header>
  );
}
