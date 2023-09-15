import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

function App() {
    const [copied, setCopied] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(true);
    const [hasLowercase, setHasLowercase] = useState(true);
    const [hasNumbers, setHasNumbers] = useState(true);
    const [hasSpecial, setHasSpecial] = useState(true);
    const [passwordLength, setPasswordLength] = useState(8);
    const [password, setPassword] = useState(generatePassword(passwordLength));
    const [theme, setTheme] = useState('light');
    const copiedTimeout = useRef(null);

    useEffect(() => {
        if (copied) {
            clearTimeout(copiedTimeout.current);
            copiedTimeout.current = setTimeout(() => setCopied(false), 1000);
        }
    }, [copied]);

    function generatePassword(length) {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghjiklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()';

        let allowableChars = '';
        if (hasUppercase) allowableChars += uppercase;
        if (hasLowercase) allowableChars += lowercase;
        if (hasNumbers) allowableChars += numbers;
        if (hasSpecial) allowableChars += special;

        if (!allowableChars) {
            setHasLowercase(true);
            allowableChars = lowercase;
        }

        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            generatedPassword += allowableChars[Math.floor(Math.random() * allowableChars.length)];
        }

        if (hasUppercase && !/[A-Z]/.test(generatedPassword)) {
            const randomPos = Math.floor(Math.random() * length);
            generatedPassword = replaceAt(generatedPassword, randomPos, uppercase[Math.floor(Math.random() * uppercase.length)]);
        }
        if (hasLowercase && !/[a-z]/.test(generatedPassword)) {
            const randomPos = Math.floor(Math.random() * length);
            generatedPassword = replaceAt(generatedPassword, randomPos,lowercase[Math.floor(Math.random() *lowercase.length)]);
        }
        if (hasNumbers && !/\d/.test(generatedPassword)) {
            const randomPos = Math.floor(Math.random() * length);
            generatedPassword = replaceAt(generatedPassword, randomPos, numbers[Math.floor(Math.random() * numbers.length)]);
        }
        if (hasSpecial && !/[!@#$%^&*()]/.test(generatedPassword)) {
            const randomPos = Math.floor(Math.random() * length);
            generatedPassword = replaceAt(generatedPassword, randomPos, special[Math.floor(Math.random() * special.length)]);
        }

        return generatedPassword;
    }

    function replaceAt(string, index, replacement) {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    }

    function getPasswordStrength(pwd) {
        const hasUppercase = /[A-Z]/.test(pwd);
        const hasLowercase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);
        const hasSpecial = /[!@#$%^&*()]/.test(pwd);

        const totalTrue = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(Boolean).length;

        if (pwd.length < 8) return 'Too short';
        if (totalTrue === 4) return 'Hard';
        if (totalTrue === 3) return 'Medium';
        return 'Easy';
    }

    function getPasswordStrengthColor(strength) {
        switch (strength) {
            case 'Hard':
                return 'green';
            case 'Medium':
                return 'orange';
            case 'Easy':
            case 'Too short':
                return 'red';
            default:
                return 'black';
        }
    }

    function toggleTheme() {
        if (theme === 'light') {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    }

    return (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-all'>
            <div className='bg-white dark:bg-gray-900 dark:text-white p-8 rounded-xl shadow-lg w-96'>
                {theme === 'light' ? (
                    <MdDarkMode size={25} onClick={toggleTheme} />
                ) : (
                    <MdLightMode size={25} onClick={toggleTheme} />
                )}
                <h1 className='text-2xl font-bold mb-4 mt-4'>Password Generator</h1>
                <div className='mb-4'>
                    <input type='text' value={password} readOnly style={{ borderColor: getPasswordStrengthColor(getPasswordStrength(password)) }} className='w-full p-2 border-4 rounded-md dark:text-black' />
                    <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>Password Strength: {getPasswordStrength(password)}</p>
                </div>

                <div className='flex items-center justify-between mb-4'>
                    <CopyToClipboard text={password} onCopy={() => setCopied(true)}>
                        <button className='bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600'>{copied ? 'Copied!' : 'Copy'}</button>
                    </CopyToClipboard>
                </div>

                <div className='grid grid-cols-2 gap-4 mb-4'>
                    <label className='flex items-center'>
                        <input type='checkbox' checked={hasUppercase} onChange={() => setHasUppercase(!hasUppercase)} className='mr-2' />
                        Uppercase
                    </label>
                    <label>
                        <input type='checkbox' checked={hasLowercase} onChange={() => setHasLowercase(!hasLowercase)} className='mr-2' />
                        Lowercase
                    </label>
                    <label>
                        <input type='checkbox' checked={hasNumbers} onChange={() => setHasNumbers(!hasNumbers)} className='mr-2' />
                        Numbers
                    </label>
                    <label>
                        <input type='checkbox' checked={hasSpecial} onChange={() => setHasSpecial(!hasSpecial)} className='mr-2' />
                        Special Characters
                    </label>
                </div>

                <div className='flex items-center justify-between mb-4'>
                    <label className='flex items-center'>
                        Length:
                        <input type="number" value={passwordLength} onChange={(e) => setPasswordLength(e.target.value)} min="4" className='ml-2 w-16 p-1 border rounded-md dark:text-black' />
                    </label>
                    <button onClick={() => setPassword(generatePassword(passwordLength))} className='bg-indigo-500 text-white rounded-md px-4 py-2 hover:bg-indigo-600'>Generate</button>
                </div>
            </div>
        </div>
    );
}

export default App;