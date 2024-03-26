import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { Table } from '@phosphor-icons/react/dist/ssr/Table';
import { ChartBar} from '@phosphor-icons/react/dist/ssr/ChartBar';
import { Notebook} from '@phosphor-icons/react/dist/ssr/Notebook';
import { HouseLine } from '@phosphor-icons/react/dist/ssr/HouseLine';
import { TerminalWindow  as Terminal } from '@phosphor-icons/react/dist/ssr/TerminalWindow';
import { BookOpenText  as BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpenText';


export const navIcons = {
  'chart-pie': ChartPieIcon,
  'chart-bar': ChartBar,
  'table': Table,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'notebook': Notebook,
  'home': HouseLine,
  'terminal': Terminal,
  'log':  BookOpen,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
