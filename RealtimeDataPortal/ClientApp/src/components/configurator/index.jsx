import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

import { useNotification } from "../../hooks/useNotification";
import { useForm } from '@mantine/hooks';
import { TextInput, Space, Button, MultiSelect, ActionIcon } from '@mantine/core';

import { IoAdd } from 'react-icons/io5';

import { useRequest } from "../../hooks/useRequest";
import AddChangeFolder from "./forms/folder/AddChangeFolder";
import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from "../loader/appPreloader";
import AddChangeExternalPage from './forms/external-page/AddChangeExternalPage';

const attributesInputs = {
	required: true
}

export { useEffect, useState, useParams, useRequest, useNotification, useRef,
    AddChangeFolder, AppPreloader, ErrorsPage, AddChangeExternalPage,
    attributesInputs,
    TextInput, Space, Button, useForm, MultiSelect, ActionIcon,
    IoAdd };