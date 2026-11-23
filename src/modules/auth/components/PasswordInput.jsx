import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { AuthInput } from './AuthInput';

/** Password field with a show/hide toggle, built on top of AuthInput. */
export const PasswordInput = ({ icon: Icon = Lock, inputClassName = '', ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <AuthInput
      {...props}
      icon={Icon}
      type={visible ? 'text' : 'password'}
      inputClassName={`font-mono tracking-wider ${inputClassName}`}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8c6b53] hover:text-[#4a2a17]"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
};
