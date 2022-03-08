import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import 'bootstrap/dist/css/bootstrap.css';
import "./index.sass"

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
	<Provider store={store}>
		<MantineProvider>
			<NotificationsProvider>
				<ModalsProvider>
					<BrowserRouter basename={baseUrl}>
						<StrictMode>
							<App />
						</StrictMode>
					</BrowserRouter>
				</ModalsProvider>
			</NotificationsProvider>
		</MantineProvider>
	</Provider>,
	rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// настройка для json при публикации приложения
//"homepage": "http://asodu-web.nknh.ru/RealtimeDataportal/",