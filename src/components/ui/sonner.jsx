import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-gray-500',
          actionButton:
            'group-[.toast]:bg-primary-700 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500',
          success: 'group-[.toaster]:border-green-500 group-[.toaster]:bg-green-50',
          error: 'group-[.toaster]:border-red-500 group-[.toaster]:bg-red-50',
          warning: 'group-[.toaster]:border-yellow-500 group-[.toaster]:bg-yellow-50',
          info: 'group-[.toaster]:border-blue-500 group-[.toaster]:bg-blue-50',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
