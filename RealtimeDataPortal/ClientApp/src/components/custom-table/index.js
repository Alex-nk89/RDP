import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useRequest } from '../../hooks/useRequest';

import { ActionIcon } from '@mantine/core';
import { BsShareFill } from 'react-icons/bs';

import AppPreloader from '../loader/appPreloader';
import ErrorsPage from '../errors-page/ErrorsPage';
import { Table } from './Table';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

export {
    useEffect, useMemo
    , useSelector, useDispatch
    , useParams
    , useRequest
    , ActionIcon
    , BsShareFill
    , AppPreloader, ErrorsPage, Table, TableRow, TableCell
};