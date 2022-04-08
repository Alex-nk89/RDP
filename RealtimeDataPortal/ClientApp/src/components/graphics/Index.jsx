import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Grid, LoadingOverlay, Space, Tabs, Tooltip } from '@mantine/core';
import { BsTable, BsGraphUp, BsPrinter, BsGridFill } from 'react-icons/bs';

import TabsHeader from "./tabs/Tabs";
import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from '../loader/appPreloader';
import HeaderGraphics from './header/HeaderGraphics';
import TabContent from "./tabs/TabsContent";
import Graphic from "./graphic/Graphic";
import Settings from "./settings/Settings";
import Calendar from './calendar/Calendar';
import MonthCalendar from "./calendar/MonthCalendar";
import DayCalendar from "./calendar/DayCalendar";
import RangeCalendar from "./calendar/RangeCalendar";
import Chart from "./graphic/Chart";
import ApexChart from './graphic/ApexChart';
import TableForGraphic from "./table/TableForGraphic";

import { useFormateDate } from '../../hooks/useFormateDate';
import { useRequest } from '../../hooks/useRequest';

export {
    useState, useEffect, useCallback, useMemo, useRef,
    useParams,
    useSelector, useDispatch, createSelector,
    TabsHeader, ErrorsPage, AppPreloader, HeaderGraphics, TabContent, Graphic, Settings, Calendar,
    MonthCalendar, DayCalendar, RangeCalendar, useFormateDate, useRequest, Chart, ApexChart, TableForGraphic,
    Grid, LoadingOverlay, Space, Tooltip, Button, Tabs,
    BsGraphUp, BsPrinter, BsTable, BsGridFill
};