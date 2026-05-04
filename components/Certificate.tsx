import { formatDate } from '@/utils/format-date';

interface CertificateProps {
  userName: string;
  company: string;
  date: Date;
  courseName: string;
  responsive?: boolean;
}

export function Certificate({ userName, company, date, courseName, responsive = false }: CertificateProps) {
  const containerClasses = responsive
    ? "relative w-full min-w-[320px] aspect-[4/3] bg-white p-4 sm:p-8 mx-auto"
    : "relative w-[800px] h-[600px] bg-white p-8 mx-auto";

  const logoClasses = responsive
    ? "h-12 sm:h-16 md:h-24 w-auto object-contain"
    : "h-24 w-auto object-contain";

  const certifyTextClasses = responsive
    ? "text-sm sm:text-lg md:text-xl text-gray-800"
    : "text-xl text-gray-800";

  const nameTextClasses = responsive
    ? "text-base sm:text-xl md:text-2xl font-semibold text-gray-900"
    : "text-2xl font-semibold text-gray-900";

  const completedTextClasses = responsive
    ? "text-sm sm:text-lg md:text-xl text-gray-800"
    : "text-xl text-gray-800";

  const courseNameClasses = responsive
    ? "text-lg sm:text-2xl md:text-3xl font-bold text-gray-900"
    : "text-3xl font-bold text-gray-900";

  const dateTextClasses = responsive
    ? "text-sm sm:text-base md:text-lg"
    : "text-lg";

  const paddingClasses = responsive
    ? "py-4 sm:py-8 md:py-12"
    : "py-12";

  const spacingClasses = responsive
    ? "space-y-4 sm:space-y-6 md:space-y-8"
    : "space-y-8";

  const datePaddingClasses = responsive
    ? "pl-4 sm:pl-8 md:pl-12"
    : "pl-12";

  return (
    <div className={containerClasses}>
      {/* Border */}
      <div className="absolute inset-4 border-4 border-gray-300"></div>
      <div className="absolute inset-6 border-2 border-gray-300"></div>

      <div className={`relative h-full flex flex-col items-center justify-between ${paddingClasses}`}>
        {/* Logo Container */}
        <div className="flex justify-center items-center w-full">
          <img 
            src="/assets/sosalogo.png" 
            alt="Logo de SOGEA SATOM" 
            className={logoClasses}
          />
        </div>

        {/* Certificate Content */}
        <div className={`${spacingClasses} text-center px-4`}>
          <p className={certifyTextClasses}>
            La société Sogea Satom Cameroun Certifie que
          </p>
          <p className={nameTextClasses}>
            {userName.toUpperCase()} de la société {company.toUpperCase()}
          </p>
          <p className={completedTextClasses}>
            a réussi à compléter le programme de formation suivant :
          </p>
          <h1 className={courseNameClasses}>
            {courseName}
          </h1>
        </div>

        {/* Date */}
        <div className={`text-left w-full ${datePaddingClasses}`}>
          <p className={dateTextClasses}>
            <span className="font-semibold">Date : </span>
            {formatDate(date)}
          </p>
        </div>
      </div>
    </div>
  );
}