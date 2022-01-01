import {HTMLProps, ReactNode, useEffect, useRef, useState} from "react";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import styles from '../styles/Dropdown.module.scss'

type Placement = 'left' | 'right' | 'top' | 'bottom'

export interface DropdownProps extends HTMLProps<HTMLDivElement> {
    trigger_content: ReactNode | ((isOpen: boolean) => ReactNode),
    children: ReactNode,
    disabled?: boolean,
    position?: Placement,
    align?: Placement,
}

export const Dropdown = ({
                             trigger_content,
                             children,
                             position = 'bottom',
                             align = 'left',
                             disabled = false,
                             className,
                             ...props
                         }: DropdownProps) => {
    const container = useRef<HTMLDivElement>(null);
    const [isOpen, toggleOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (container?.current && !container.current.contains(event.target as HTMLDivElement)) {
                toggleOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dropdown = isOpen
        ? <div className={`dropdown-pane ${position || ''}`}
               style={{display: 'block', visibility: 'visible', [align]: 0}}
        >
            {children}
        </div>
        : null;

    return (
        <div className={`${styles.dropdownContainer} ${disabled ? 'disabled' : ''} ${className}`}
             ref={container}
             onClick={() => !disabled && toggleOpen(!isOpen)}
             onKeyPress={() => !disabled && toggleOpen(!isOpen)}
             tabIndex={0}
             {...props}
        >
            <div className="dropdown-trigger">
                {typeof trigger_content == "function" ? trigger_content(isOpen) : trigger_content}
            </div>
            {dropdown}
        </div>
    );
}

export interface DropdownMenuProps extends Omit<DropdownProps, 'children'> {
    options: { [keys: string]: ReactNode }
}

export const DropdownMenu = ({options, className, ...props}: DropdownMenuProps) =>
    <Dropdown className={`${styles.dropdownMenuContainer} ${className}`} {...props}>
        <ul className="menu">
            {Object.entries(options).map(([key, element]) =>
                <li key={key}>{element}</li>
            )}
        </ul>
    </Dropdown>

interface DropdownHeaderProps {
    label: string
}

export const DropdownHeader = ({label}: DropdownHeaderProps) => <span className={styles.dropdownHeader}><em>{label}</em></span>

interface ButtonTriggerProps {
    label: ReactNode
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'alert'
    hollow?: boolean
}

export const buttonTrigger = ({label, color = 'primary', hollow = true}: ButtonTriggerProps) =>
    (isOpen: boolean) =>
        <button className={`button ${color} ${hollow ? 'hollow' : ''}`}>
            {label}{' '}
            {isOpen ? <FiChevronUp height={0.8}/> : <FiChevronDown/>}
        </button>
