/**
 * 약관 4종 문구 (S25 약관·개인정보 열람). 프로토타입 v4.2 의 storywalkPolicies 를 그대로 옮겼다.
 * 각 항목: title [한, 영], sections [[제목 [한, 영]], [본문 [한, 영]]], sources [한, 영, 주소]
 *
 * TODO: 문구가 아직 '브라우저에만 저장' 기준의 시연판 초안이다. 백엔드 저장으로 바뀐 내용에 맞게 기획과 함께 고친다.
 */
const policies = {
  terms: {
    title: ["이용약관", "Terms of use"],
    sections: [
      [
        ["서비스 범위", "Scope"],
        [
          "ㅇㅋㅋ-Walk Creator Crew는 서울의 장소 탐색, 해설, 추천 코스와 여행 일정 기능을 제공하는 시연용 서비스입니다. 실제 인식·인증 등 연결 상태는 해당 화면에 표시합니다.",
          "ㅇㅋㅋ-Walk Creator Crew is a prototype for discovering places, listening to guides, exploring walks, and planning visits. Each screen indicates which integrations are active.",
        ],
      ],
      [
        ["콘텐츠 이용", "Content use"],
        [
          "사진과 해설은 표시된 출처와 이용 조건을 따릅니다. 사진이나 일정에 타인의 권리를 침해하는 내용 또는 공개를 원하지 않는 개인정보를 넣지 마세요.",
          "Follow the displayed source and usage conditions for photos and guides. Respect others’ rights and avoid including private information in photos or walks.",
        ],
      ],
      [
        ["외부 서비스와 현장 정보", "External services and visits"],
        [
          "지도, 공식 관광 해설, 행사 일정 등 외부 페이지에는 각 제공자의 약관이 적용됩니다. 방문 전 운영 여부와 예약 정보는 장소의 공식 안내를 확인해 주세요.",
          "External maps, official guides, and event listings have their own terms. Check official opening and booking information before visiting.",
        ],
      ],
      [
        ["변경 안내", "Changes"],
        [
          "기능과 약관에 변경이 생기면 이 화면의 적용 범위와 관련 안내를 업데이트합니다. 시연용으로 저장한 일정과 대화는 현재 브라우저에 보관됩니다.",
          "We update this page when functionality or the scope of these terms changes. Demo walks and messages are stored in the current browser.",
        ],
      ],
    ],
    sources: [["오디 이용약관", "Odii terms of use", "https://www.odii.kr/smarttour_web/setting/terms?lang=ko"]],
  },
  privacy: {
    title: ["개인정보 처리방침", "Privacy policy"],
    sections: [
      [
        ["처리 항목과 목적", "Data and purposes"],
        [
          "이 프로토타입은 언어와 권한 선택, 체험 로그인 상태, 프로필 이름과 사진, 일정·찜·일정 대화를 브라우저에 저장할 수 있습니다. 기기에서 설정과 작업 내용을 다시 불러오는 데 사용합니다.",
          "This prototype can store language and permission preferences, demo sign-in, profile name and photo, walks, favorites, and walk messages in your browser so you can resume work on the device.",
        ],
      ],
      [
        ["보관과 삭제", "Retention and deletion"],
        [
          "로컬 데이터는 브라우저에서 사이트 데이터를 지울 때까지 남을 수 있습니다. 현재 위치와 장소 확인을 위해 고른 사진은 페이지 메모리에서 사용합니다. 시연판의 체험 로그인은 Google 계정 정보를 요청하지 않습니다.",
          "Local records may remain until you clear the browser’s site data. The current location and photos selected for place discovery are used in page memory. Demo sign-in does not request Google account information.",
        ],
      ],
      [
        ["외부 연결", "External connections"],
        [
          "지도의 배경을 불러오거나 오디 등 외부 페이지를 열면 해당 서비스에 일반 접속 정보가 전달될 수 있습니다. 지도 타일 요청은 화면에 표시하려는 지도 범위를 포함합니다.",
          "Loading a basemap or opening an external page such as Odii may send ordinary connection information to that service. Map-tile requests include the area shown on screen.",
        ],
      ],
      [
        ["열람과 설정 변경", "Review and controls"],
        [
          "프로필과 일정은 앱에서 확인하거나 수정할 수 있습니다. 권한은 브라우저의 사이트 설정에서 변경할 수 있고, 로컬 데이터는 브라우저 설정에서 삭제할 수 있습니다.",
          "You can inspect or edit profiles and walks in the app, change permissions in your browser’s site settings, and erase local records through browser settings.",
        ],
      ],
    ],
    sources: [
      ["오디 개인정보 처리방침", "Odii privacy policy", "https://www.odii.kr/smarttour_web/setting/privacy?lang=ko"],
      [
        "개인정보보호위원회 작성 지침",
        "Korean privacy commission guidance",
        "https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030040&nttId=11134",
      ],
    ],
  },
  location: {
    title: ["위치기반서비스 이용약관", "Location-based service terms"],
    sections: [
      [
        ["위치를 사용하는 기능", "Location features"],
        [
          "위치 사용을 허용하면 브라우저에서 받은 현재 좌표로 지도에 내 위치를 표시하고 가까운 역사 명소와 직선거리를 계산합니다.",
          "With permission, the app uses the location supplied by the browser to show you on the map and calculate nearby heritage places and straight-line distances.",
        ],
      ],
      [
        ["권한과 처리 범위", "Permission and processing"],
        [
          "위치 동의 화면에서 선택할 수 있으며 브라우저가 허용 여부를 별도로 확인합니다. 현재 좌표는 페이지 메모리에서 사용합니다. 내 위치 주변으로 지도를 이동하면 그 화면 범위의 지도 타일을 외부 지도 제공자에게 요청합니다.",
          "You can choose on the location consent screen. Your browser asks separately for permission. Coordinates are used in page memory. Centering the map on your location requests tiles for that view from the map provider.",
        ],
      ],
      [
        ["거부와 철회", "Declining and revoking"],
        [
          "위치를 쓰지 않아도 검색, 장소 상세와 일반 지도를 이용할 수 있습니다. 브라우저 사이트 설정에서 위치 접근을 차단하거나 이전 선택을 바꿀 수 있습니다.",
          "Search, place details, and the general map remain available without location. You can block location or change your choice in the browser’s site settings.",
        ],
      ],
    ],
    sources: [
      [
        "오디 위치기반서비스 이용약관",
        "Odii location terms",
        "https://www.odii.kr/smarttour_web/setting/terms/gps?lang=ko",
      ],
    ],
  },
  photos: {
    title: ["카메라·갤러리 이용약관", "Camera and gallery terms"],
    sections: [
      [
        ["접근 범위", "Access scope"],
        [
          "촬영을 선택하면 기기 카메라가 열리거나 브라우저가 카메라 권한을 요청합니다. 갤러리에서는 사용자가 직접 선택한 사진만 읽습니다. 프로필 사진 변경도 선택한 사진만 사용합니다.",
          "Choosing capture opens the device camera or prompts for browser permission. The gallery reads only the photo you select. Profile photo editing also uses only the selected photo.",
        ],
      ],
      [
        ["사진 사용과 보관", "Photo use and storage"],
        [
          "장소 사진은 이 프로토타입에서 미리보기와 장소 선택에 사용하고 서버로 전송하지 않습니다. 프로필 사진으로 저장한 이미지는 현재 브라우저에 남을 수 있습니다. 학습 선택 항목은 동의 여부만 기록하며 실제 학습을 수행하지 않습니다.",
          "Place photos are used for preview and place selection in this prototype and are not uploaded. A saved profile image can remain in the current browser. The training choice records a preference only. No training runs in this prototype.",
        ],
      ],
      [
        ["권한 변경", "Managing permissions"],
        [
          "카메라를 허용하지 않아도 갤러리에서 사진을 고르거나 장소를 검색할 수 있습니다. 카메라 권한은 브라우저나 기기 설정에서 바꾸고, 사진·학습 선택은 앱 설정에서 다시 정할 수 있습니다.",
          "If you decline camera access, you can choose a photo from the gallery or search by place name. Manage camera access in browser or device settings, and reset photo or training choices in app settings.",
        ],
      ],
    ],
    sources: [
      [
        "Google 지도 사진 권한 안내",
        "Google Maps photo permissions",
        "https://support.google.com/maps/answer/10204872?hl=en-GB",
      ],
      [
        "Android 사진 접근 안내",
        "Android photo access guidance",
        "https://developer.android.com/privacy-and-security/minimize-permission-requests",
      ],
    ],
  },
};

export default policies
