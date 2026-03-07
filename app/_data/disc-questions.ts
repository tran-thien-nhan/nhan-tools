export interface DiscQuestion {
    id: number;
    question: string;
    options: {
        A: {
            text: string;
            trait: 'D' | 'I' | 'S' | 'C';
        };
        B: {
            text: string;
            trait: 'D' | 'I' | 'S' | 'C';
        };
    };
}

export interface DiscResult {
    type: string; // "D", "I", "S", "C", hoặc kết hợp "DI", "SC", v.v.
    title: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    communicationTips: string[];
    suitableCareers: string[];
}

export const discResults: DiscResult[] = [
    {
        type: "D",
        title: "Người thống lĩnh (Dominance)",
        description: "Bạn là người mạnh mẽ, quyết đoán và hướng tới kết quả. Bạn thích kiểm soát, thách thức và đạt được mục tiêu. Bạn không ngại đối mặt với khó khăn và luôn tìm cách vượt qua trở ngại.",
        strengths: [
            "Quyết đoán, ra quyết định nhanh chóng",
            "Tự tin, dám nghĩ dám làm",
            "Có tầm nhìn và khả năng lãnh đạo",
            "Giải quyết vấn đề hiệu quả",
            "Kiên trì theo đuổi mục tiêu"
        ],
        weaknesses: [
            "Đôi khi thiếu kiên nhẫn",
            "Có thể bảo thủ, khó tiếp thu ý kiến",
            "Dễ nóng nảy khi gặp trở ngại",
            "Quan tâm đến kết quả hơn quá trình",
            "Có thể làm tổn thương cảm xúc người khác"
        ],
        communicationTips: [
            "Giao tiếp thẳng thắn, đi thẳng vào vấn đề",
            "Tập trung vào kết quả và giải pháp",
            "Tôn trọng quyền tự chủ của họ",
            "Tránh nói vòng vo, dài dòng",
            "Thể hiện sự chuyên nghiệp và năng lực"
        ],
        suitableCareers: [
            "Giám đốc điều hành",
            "Quản lý dự án",
            "Doanh nhân",
            "Luật sư",
            "Chính trị gia"
        ]
    },
    {
        type: "I",
        title: "Người ảnh hưởng (Influence)",
        description: "Bạn là người sôi nổi, nhiệt tình và có khả năng truyền cảm hứng. Bạn thích giao tiếp, kết nối và tạo ảnh hưởng đến người khác. Bạn luôn mang đến năng lượng tích cực cho mọi người xung quanh.",
        strengths: [
            "Giao tiếp tốt, dễ kết bạn",
            "Lạc quan, nhiệt huyết",
            "Sáng tạo, có nhiều ý tưởng mới",
            "Biết cách động viên và truyền cảm hứng",
            "Linh hoạt, thích ứng nhanh"
        ],
        weaknesses: [
            "Đôi khi thiếu kiểm soát cảm xúc",
            "Dễ bị phân tâm",
            "Có thể hứa hẹn quá nhiều",
            "Ít chú ý đến chi tiết",
            "Dễ nản khi gặp khó khăn"
        ],
        communicationTips: [
            "Giao tiếp cởi mở, thân thiện",
            "Công nhận thành tích và khen ngợi họ",
            "Tạo cơ hội để họ thể hiện bản thân",
            "Lắng nghe ý tưởng của họ",
            "Sử dụng ngôn ngữ cơ thể tích cực"
        ],
        suitableCareers: [
            "Chuyên viên marketing",
            "Nhân viên PR - truyền thông",
            "Tư vấn viên",
            "Giáo viên",
            "Diễn giả"
        ]
    },
    {
        type: "S",
        title: "Người kiên định (Steadiness)",
        description: "Bạn là người điềm tĩnh, đáng tin cậy và biết lắng nghe. Bạn coi trọng sự ổn định, hòa hợp trong các mối quan hệ. Bạn luôn sẵn sàng hỗ trợ và giúp đỡ người khác một cách tận tình.",
        strengths: [
            "Kiên nhẫn, biết lắng nghe",
            "Đáng tin cậy, trung thành",
            "Hợp tác tốt trong nhóm",
            "Giữ bình tĩnh trong khủng hoảng",
            "Quan tâm đến cảm xúc người khác"
        ],
        weaknesses: [
            "Khó thích nghi với thay đổi",
            "Đôi khi thiếu quyết đoán",
            "Tránh đối đầu, xung đột",
            "Có thể bị lợi dụng lòng tốt",
            "Chậm đưa ra quyết định"
        ],
        communicationTips: [
            "Giao tiếp nhẹ nhàng, chân thành",
            "Tạo môi trường thoải mái, an toàn",
            "Cho họ thời gian để thích nghi",
            "Thể hiện sự quan tâm và tôn trọng",
            "Tránh gây áp lực quá lớn"
        ],
        suitableCareers: [
            "Nhân viên hành chính",
            "Chăm sóc khách hàng",
            "Nhân sự",
            "Nhà tâm lý học",
            "Điều dưỡng"
        ]
    },
    {
        type: "C",
        title: "Người tuân thủ (Conscientiousness)",
        description: "Bạn là người cẩn thận, chính xác và có tư duy logic. Bạn coi trọng chất lượng, quy trình và các tiêu chuẩn. Bạn luôn kiểm tra kỹ lưỡng mọi thứ trước khi đưa ra kết luận.",
        strengths: [
            "Cẩn thận, tỉ mỉ",
            "Tư duy logic, phân tích tốt",
            "Có tổ chức, làm việc có kế hoạch",
            "Trung thực, nguyên tắc",
            "Chất lượng công việc cao"
        ],
        weaknesses: [
            "Khá cứng nhắc, khó thay đổi",
            "Có thể cầu toàn quá mức",
            "Khó gần, ít cởi mở",
            "Chậm ra quyết định do cân nhắc quá kỹ",
            "Đôi khi thiếu linh hoạt"
        ],
        communicationTips: [
            "Cung cấp thông tin chi tiết, chính xác",
            "Tôn trọng nguyên tắc và quy trình",
            "Trình bày logic, có dẫn chứng",
            "Cho họ thời gian để phân tích",
            "Tránh nói chung chung, mơ hồ"
        ],
        suitableCareers: [
            "Kiểm toán viên",
            "Kỹ sư phần mềm",
            "Nhà nghiên cứu",
            "Chuyên viên phân tích tài chính",
            "Quản lý chất lượng"
        ]
    },
    {
        type: "DI",
        title: "Người thúc đẩy (Dominance + Influence)",
        description: "Bạn kết hợp sự quyết đoán của nhóm D và sự sôi nổi của nhóm I. Bạn là người hành động nhanh và có khả năng truyền cảm hứng cho người khác. Bạn thích dẫn dắt, tạo ảnh hưởng và đạt được thành tích cao.",
        strengths: [
            "Quyết đoán và lôi cuốn",
            "Khả năng lãnh đạo xuất sắc",
            "Thích ứng nhanh với thay đổi",
            "Truyền cảm hứng cho người khác",
            "Dám nghĩ dám làm"
        ],
        weaknesses: [
            "Có thể thiếu kiên nhẫn với người chậm",
            "Đôi khi nóng vội trong quyết định",
            "Khó chấp nhận thất bại",
            "Có thể bỏ qua chi tiết quan trọng"
        ],
        communicationTips: [
            "Giao tiếp thẳng thắn nhưng thân thiện",
            "Tôn trọng vai trò lãnh đạo của họ",
            "Thách thức họ bằng những mục tiêu mới",
            "Ghi nhận thành tích kịp thời"
        ],
        suitableCareers: [
            "CEO công ty khởi nghiệp",
            "Giám đốc kinh doanh",
            "Quản lý dự án cấp cao",
            "Chuyên gia tư vấn chiến lược"
        ]
    },
    {
        type: "DC",
        title: "Người phân tích (Dominance + Conscientiousness)",
        description: "Bạn là người quyết đoán nhưng cũng rất cẩn thận. Bạn thích kiểm soát và đảm bảo mọi thứ đúng quy trình. Bạn có khả năng phân tích tốt và ra quyết định dựa trên dữ liệu.",
        strengths: [
            "Quyết đoán nhưng có cơ sở",
            "Phân tích sắc bén",
            "Quản lý rủi ro tốt",
            "Chú trọng chất lượng và kết quả",
            "Có tầm nhìn chiến lược"
        ],
        weaknesses: [
            "Có thể khá cứng nhắc",
            "Khó gần gũi với người khác",
            "Đôi khi quá nghiêm khắc",
            "Cầu toàn quá mức"
        ],
        communicationTips: [
            "Cung cấp dữ liệu và bằng chứng",
            "Tôn trọng quyền ra quyết định của họ",
            "Trình bày logic, có hệ thống",
            "Tránh cảm tính, mơ hồ"
        ],
        suitableCareers: [
            "Giám đốc tài chính",
            "Luật sư doanh nghiệp",
            "Chuyên gia phân tích đầu tư",
            "Quản lý rủi ro"
        ]
    },
    {
        type: "IS",
        title: "Người kết nối (Influence + Steadiness)",
        description: "Bạn là sự kết hợp hoàn hảo giữa sự sôi nổi và khả năng lắng nghe. Bạn thích giao tiếp nhưng cũng rất quan tâm đến cảm xúc người khác. Bạn là người xây dựng mối quan hệ tuyệt vời.",
        strengths: [
            "Giao tiếp tốt và biết lắng nghe",
            "Xây dựng mối quan hệ bền chặt",
            "Tạo không khí tích cực",
            "Đồng cảm và hỗ trợ người khác",
            "Linh hoạt trong giao tiếp"
        ],
        weaknesses: [
            "Khó nói lời từ chối",
            "Đôi khi thiếu quyết đoán",
            "Dễ bị ảnh hưởng bởi cảm xúc",
            "Có thể hy sinh bản thân quá mức"
        ],
        communicationTips: [
            "Giao tiếp chân thành, cởi mở",
            "Tạo môi trường thân thiện",
            "Thể hiện sự quan tâm và tôn trọng",
            "Khuyến khích họ chia sẻ ý kiến"
        ],
        suitableCareers: [
            "Quản lý nhân sự",
            "Chuyên viên đào tạo",
            "Tư vấn tâm lý",
            "Điều phối viên sự kiện"
        ]
    },
    {
        type: "SC",
        title: "Người hỗ trợ (Steadiness + Conscientiousness)",
        description: "Bạn là người điềm tĩnh, cẩn thận và có trách nhiệm. Bạn thích làm việc có quy trình và hỗ trợ người khác một cách chuyên nghiệp. Bạn là chỗ dựa đáng tin cậy cho đồng nghiệp.",
        strengths: [
            "Kiên nhẫn và tỉ mỉ",
            "Đáng tin cậy, trách nhiệm cao",
            "Làm việc có tổ chức",
            "Hỗ trợ người khác tận tình",
            "Giữ ổn định trong mọi tình huống"
        ],
        weaknesses: [
            "Khó thích ứng với thay đổi",
            "Chậm trong quyết định",
            "Thiếu linh hoạt",
            "Đôi khi quá nguyên tắc"
        ],
        communicationTips: [
            "Giao tiếp rõ ràng, chi tiết",
            "Tôn trọng quy trình và nguyên tắc",
            "Tạo môi trường làm việc ổn định",
            "Ghi nhận đóng góp của họ"
        ],
        suitableCareers: [
            "Kế toán viên",
            "Quản trị viên hệ thống",
            "Kiểm soát chất lượng",
            "Thư ký hành chính"
        ]
    }
];

// Hàm tính toán kết quả DISC từ câu trả lời
export const calculateDiscResult = (answers: Record<number, 'A' | 'B'>): string => {
    const scores = {
        D: 0,
        I: 0,
        S: 0,
        C: 0
    };

    // Đếm số lượng trait từ các câu trả lời
    Object.entries(answers).forEach(([questionId, answer]) => {
        const question = discQuestions[parseInt(questionId)];
        if (question) {
            const trait = question.options[answer].trait;
            scores[trait]++;
        }
    });

    // Tìm trait có điểm cao nhất
    let maxTrait: 'D' | 'I' | 'S' | 'C' = 'D';
    let maxScore = 0;

    (Object.keys(scores) as Array<keyof typeof scores>).forEach(trait => {
        if (scores[trait] > maxScore) {
            maxScore = scores[trait];
            maxTrait = trait;
        }
    });

    // Tìm trait có điểm cao thứ hai (để có thể kết hợp)
    let secondTrait: 'D' | 'I' | 'S' | 'C' | null = null;
    let secondMaxScore = 0;

    (Object.keys(scores) as Array<keyof typeof scores>).forEach(trait => {
        if (trait !== maxTrait && scores[trait] > secondMaxScore) {
            secondMaxScore = scores[trait];
            secondTrait = trait;
        }
    });

    // Nếu khoảng cách giữa trait cao nhất và thứ hai không quá lớn (ví dụ: <= 2)
    // và secondTrait không null thì trả về kết hợp, nếu không trả về trait đơn
    if (secondTrait && (maxScore - secondMaxScore <= 2)) {
        return maxTrait + secondTrait;
    }

    return maxTrait;
};

// Hàm lấy thông tin kết quả DISC theo type
export const getDiscResultByType = (type: string): DiscResult | undefined => {
    return discResults.find(result => result.type === type);
};

// Hàm lấy mô tả ngắn gọn cho từng trait
export const getTraitDescription = (trait: 'D' | 'I' | 'S' | 'C'): string => {
    const descriptions = {
        D: "Thống lĩnh - Quyết đoán, mạnh mẽ, hướng tới kết quả",
        I: "Ảnh hưởng - Sôi nổi, nhiệt tình, giao tiếp tốt",
        S: "Kiên định - Điềm tĩnh, đáng tin cậy, biết lắng nghe",
        C: "Tuân thủ - Cẩn thận, chính xác, tư duy logic"
    };
    return descriptions[trait];
};

export const discQuestions: DiscQuestion[] = [
    {
        id: 0,
        question: "Khi làm việc nhóm, bạn thường:",
        options: {
            A: {
                text: "Chủ động đưa ra ý kiến và dẫn dắt cuộc thảo luận",
                trait: "D"
            },
            B: {
                text: "Lắng nghe và hỗ trợ đồng đội khi cần thiết",
                trait: "S"
            }
        }
    },
    {
        id: 1,
        question: "Trong giao tiếp hàng ngày, bạn:",
        options: {
            A: {
                text: "Nói nhiều, sôi nổi và dễ dàng kết bạn mới",
                trait: "I"
            },
            B: {
                text: "Nói ít nhưng khi nói thường có trọng tâm",
                trait: "C"
            }
        }
    },
    {
        id: 2,
        question: "Khi đối mặt với thử thách, bạn:",
        options: {
            A: {
                text: "Xông pha ngay không ngần ngại",
                trait: "D"
            },
            B: {
                text: "Cân nhắc kỹ lưỡng trước khi hành động",
                trait: "C"
            }
        }
    },
    {
        id: 3,
        question: "Trong các mối quan hệ, bạn coi trọng:",
        options: {
            A: {
                text: "Sự chân thành và ổn định lâu dài",
                trait: "S"
            },
            B: {
                text: "Sự thú vị và mới mẻ trong các mối quan hệ",
                trait: "I"
            }
        }
    },
    {
        id: 4,
        question: "Khi quyết định mua một món đồ đắt tiền:",
        options: {
            A: {
                text: "Mua ngay nếu thích, không suy nghĩ nhiều",
                trait: "I"
            },
            B: {
                text: "So sánh giá, đọc review kỹ lưỡng trước khi mua",
                trait: "C"
            }
        }
    },
    {
        id: 5,
        question: "Đồng nghiệp thường nhận xét bạn là người:",
        options: {
            A: {
                text: "Quyết đoán, dám nghĩ dám làm",
                trait: "D"
            },
            B: {
                text: "Điềm tĩnh, ít khi nổi nóng",
                trait: "S"
            }
        }
    },
    {
        id: 6,
        question: "Khi tham gia một bữa tiệc đông người:",
        options: {
            A: {
                text: "Hòa nhập nhanh và là tâm điểm của bữa tiệc",
                trait: "I"
            },
            B: {
                text: "Quan sát mọi người trước khi tham gia",
                trait: "C"
            }
        }
    },
    {
        id: 7,
        question: "Trong công việc, bạn thích:",
        options: {
            A: {
                text: "Được tự do sáng tạo và thể hiện bản thân",
                trait: "I"
            },
            B: {
                text: "Làm việc theo quy trình rõ ràng",
                trait: "C"
            }
        }
    },
    {
        id: 8,
        question: "Khi có bất đồng quan điểm, bạn thường:",
        options: {
            A: {
                text: "Tranh luận gay gắt để bảo vệ ý kiến",
                trait: "D"
            },
            B: {
                text: "Nhường nhịn để giữ hòa khí",
                trait: "S"
            }
        }
    },
    {
        id: 9,
        question: "Bạn cảm thấy thoải mái nhất khi:",
        options: {
            A: {
                text: "Ở một mình, làm những gì mình thích",
                trait: "S"
            },
            B: {
                text: "Tụ tập bạn bè và tham gia các hoạt động xã hội",
                trait: "I"
            }
        }
    },
    {
        id: 10,
        question: "Khi được giao một dự án mới:",
        options: {
            A: {
                text: "Bắt tay vào làm ngay, vừa làm vừa điều chỉnh",
                trait: "D"
            },
            B: {
                text: "Lên kế hoạch chi tiết trước khi bắt đầu",
                trait: "C"
            }
        }
    },
    {
        id: 11,
        question: "Bạn thích môi trường làm việc:",
        options: {
            A: {
                text: "Năng động, cạnh tranh và có nhiều thử thách",
                trait: "D"
            },
            B: {
                text: "Hòa đồng, thân thiện và hỗ trợ lẫn nhau",
                trait: "S"
            }
        }
    },
    {
        id: 12,
        question: "Khi nghe người khác nói, bạn thường:",
        options: {
            A: {
                text: "Lắng nghe và thể hiện sự đồng cảm",
                trait: "S"
            },
            B: {
                text: "Đưa ra giải pháp và lời khuyên ngay lập tức",
                trait: "D"
            }
        }
    },
    {
        id: 13,
        question: "Bạn thường chi tiêu:",
        options: {
            A: {
                text: "Thoải mái, thích là mua",
                trait: "I"
            },
            B: {
                text: "Tiết kiệm, có kế hoạch rõ ràng",
                trait: "C"
            }
        }
    },
    {
        id: 14,
        question: "Trong một cuộc tranh luận, bạn thường:",
        options: {
            A: {
                text: "Muốn là người kết thúc cuộc tranh luận",
                trait: "D"
            },
            B: {
                text: "Sẵn sàng thỏa hiệp để đôi bên cùng vui",
                trait: "S"
            }
        }
    },
    {
        id: 15,
        question: "Bạn thích học hỏi qua:",
        options: {
            A: {
                text: "Thực hành, trải nghiệm thực tế",
                trait: "I"
            },
            B: {
                text: "Đọc sách, tài liệu và nghiên cứu chuyên sâu",
                trait: "C"
            }
        }
    },
    {
        id: 16,
        question: "Khi gặp khó khăn, bạn tìm đến ai đầu tiên?",
        options: {
            A: {
                text: "Bạn bè thân thiết để được an ủi",
                trait: "S"
            },
            B: {
                text: "Người có chuyên môn để được tư vấn",
                trait: "C"
            }
        }
    },
    {
        id: 17,
        question: "Bạn thường được khen là:",
        options: {
            A: {
                text: "Có tầm nhìn và khả năng lãnh đạo",
                trait: "D"
            },
            B: {
                text: "Tỉ mỉ, cẩn thận đến từng chi tiết",
                trait: "C"
            }
        }
    },
    {
        id: 18,
        question: "Trong các mối quan hệ, bạn:",
        options: {
            A: {
                text: "Dễ dàng tha thứ và bỏ qua lỗi lầm",
                trait: "S"
            },
            B: {
                text: "Khó quên khi ai đó làm tổn thương mình",
                trait: "C"
            }
        }
    },
    {
        id: 19,
        question: "Khi lên kế hoạch du lịch, bạn thường:",
        options: {
            A: {
                text: "Đi đến đâu tính đến đó, thích sự bất ngờ",
                trait: "I"
            },
            B: {
                text: "Lên lịch trình chi tiết từ A đến Z",
                trait: "C"
            }
        }
    },
    {
        id: 20,
        question: "Bạn thấy mình phù hợp với vai trò:",
        options: {
            A: {
                text: "Người lãnh đạo, chỉ đạo người khác",
                trait: "D"
            },
            B: {
                text: "Người hỗ trợ, giúp đỡ người khác",
                trait: "S"
            }
        }
    },
    {
        id: 21,
        question: "Khi ở nơi đông người, bạn thường:",
        options: {
            A: {
                text: "Chủ động bắt chuyện và kết bạn",
                trait: "I"
            },
            B: {
                text: "Chờ người khác bắt chuyện trước",
                trait: "S"
            }
        }
    },
    {
        id: 22,
        question: "Bạn thích giải trí bằng cách:",
        options: {
            A: {
                text: "Xem phim, đọc sách ở nhà",
                trait: "S"
            },
            B: {
                text: "Đi chơi, gặp gỡ bạn bè",
                trait: "I"
            }
        }
    },
    {
        id: 23,
        question: "Khi có deadline gấp, bạn thường:",
        options: {
            A: {
                text: "Làm việc tập trung cao độ và hoàn thành nhanh",
                trait: "D"
            },
            B: {
                text: "Căng thẳng, lo lắng và cần người hỗ trợ",
                trait: "S"
            }
        }
    },
    {
        id: 24,
        question: "Bạn thích đọc thể loại sách nào?",
        options: {
            A: {
                text: "Sách self-help, phát triển bản thân",
                trait: "I"
            },
            B: {
                text: "Sách khoa học, chuyên ngành",
                trait: "C"
            }
        }
    },
    {
        id: 25,
        question: "Trong công việc, bạn ghét nhất điều gì?",
        options: {
            A: {
                text: "Bị người khác kiểm soát và chỉ đạo",
                trait: "D"
            },
            B: {
                text: "Làm việc với người thiếu chuyên nghiệp",
                trait: "C"
            }
        }
    },
    {
        id: 26,
        question: "Khi nhận được lời khen, bạn thường:",
        options: {
            A: {
                text: "Vui vẻ và hào hứng chia sẻ với mọi người",
                trait: "I"
            },
            B: {
                text: "Khiêm tốn và cho rằng mình chưa xứng đáng",
                trait: "S"
            }
        }
    },
    {
        id: 27,
        question: "Bạn thích làm việc với:",
        options: {
            A: {
                text: "Mục tiêu rõ ràng và phần thưởng xứng đáng",
                trait: "D"
            },
            B: {
                text: "Quy trình chuẩn và hướng dẫn cụ thể",
                trait: "C"
            }
        }
    },
    {
        id: 28,
        question: "Khi bạn bè gặp chuyện buồn, bạn thường:",
        options: {
            A: {
                text: "Ở bên cạnh động viên và an ủi",
                trait: "S"
            },
            B: {
                text: "Đưa ra lời khuyên và giải pháp",
                trait: "D"
            }
        }
    },
    {
        id: 29,
        question: "Bạn thích phong cách thời trang:",
        options: {
            A: {
                text: "Nổi bật, bắt mắt và độc đáo",
                trait: "I"
            },
            B: {
                text: "Lịch sự, đơn giản và thanh lịch",
                trait: "C"
            }
        }
    },
    {
        id: 30,
        question: "Trong cuộc sống, bạn coi trọng nhất:",
        options: {
            A: {
                text: "Thành công và địa vị xã hội",
                trait: "D"
            },
            B: {
                text: "Hạnh phúc và bình yên trong tâm hồn",
                trait: "S"
            }
        }
    },
    {
        id: 31,
        question: "Khi thảo luận nhóm, bạn thường:",
        options: {
            A: {
                text: "Đưa ra nhiều ý tưởng sáng tạo mới",
                trait: "I"
            },
            B: {
                text: "Phân tích tính khả thi của các ý tưởng",
                trait: "C"
            }
        }
    },
    {
        id: 32,
        question: "Bạn thấy mình dễ dàng thích nghi với:",
        options: {
            A: {
                text: "Môi trường mới và người lạ",
                trait: "I"
            },
            B: {
                text: "Thói quen cũ và bạn bè cũ",
                trait: "S"
            }
        }
    },
    {
        id: 33,
        question: "Khi làm sai, bạn thường:",
        options: {
            A: {
                text: "Nhận lỗi và sửa sai ngay lập tức",
                trait: "D"
            },
            B: {
                text: "Tránh né và cảm thấy xấu hổ",
                trait: "S"
            }
        }
    },
    {
        id: 34,
        question: "Bạn thích sắp xếp đồ đạc:",
        options: {
            A: {
                text: "Theo cảm hứng, không theo nguyên tắc nào",
                trait: "I"
            },
            B: {
                text: "Ngăn nắp, có tổ chức và dễ tìm",
                trait: "C"
            }
        }
    },
    {
        id: 35,
        question: "Trong kinh doanh, bạn thích:",
        options: {
            A: {
                text: "Đầu tư mạo hiểm để có lợi nhuận cao",
                trait: "D"
            },
            B: {
                text: "Đầu tư an toàn, ổn định lâu dài",
                trait: "S"
            }
        }
    },
    {
        id: 36,
        question: "Bạn thích nhận quà tặng:",
        options: {
            A: {
                text: "Độc đáo, bất ngờ và có giá trị",
                trait: "I"
            },
            B: {
                text: "Thiết thực, có thể sử dụng hàng ngày",
                trait: "C"
            }
        }
    },
    {
        id: 37,
        question: "Khi nghe tin vui của người khác, bạn thường:",
        options: {
            A: {
                text: "Vui mừng và chia sẻ nhiệt tình",
                trait: "I"
            },
            B: {
                text: "Chúc mừng một cách lịch sự",
                trait: "C"
            }
        }
    },
    {
        id: 38,
        question: "Bạn thường cảm thấy khó chịu khi:",
        options: {
            A: {
                text: "Phải chờ đợi ai đó quá lâu",
                trait: "D"
            },
            B: {
                text: "Bị người khác thúc giục gấp gáp",
                trait: "S"
            }
        }
    },
    {
        id: 39,
        question: "Bạn thích ăn uống ở:",
        options: {
            A: {
                text: "Nhà hàng sang trọng và mới lạ",
                trait: "I"
            },
            B: {
                text: "Quán quen và món ăn quen thuộc",
                trait: "S"
            }
        }
    },
    {
        id: 40,
        question: "Khi viết email công việc, bạn thường:",
        options: {
            A: {
                text: "Viết ngắn gọn, đi thẳng vào vấn đề",
                trait: "D"
            },
            B: {
                text: "Viết dài, chi tiết và cẩn thận",
                trait: "C"
            }
        }
    },
    {
        id: 41,
        question: "Bạn thích thể hiện tình cảm với người yêu bằng cách:",
        options: {
            A: {
                text: "Nói lời yêu thương và tặng quà",
                trait: "I"
            },
            B: {
                text: "Hành động quan tâm chăm sóc",
                trait: "S"
            }
        }
    },
    {
        id: 42,
        question: "Bạn thường giải quyết mâu thuẫn với người thân bằng cách:",
        options: {
            A: {
                text: "Nói thẳng và giải quyết dứt điểm",
                trait: "D"
            },
            B: {
                text: "Im lặng và để thời gian hàn gắn",
                trait: "S"
            }
        }
    },
    {
        id: 43,
        question: "Bạn thích học ngoại ngữ qua:",
        options: {
            A: {
                text: "Xem phim và giao tiếp với người bản xứ",
                trait: "I"
            },
            B: {
                text: "Học ngữ pháp và làm bài tập",
                trait: "C"
            }
        }
    },
    {
        id: 44,
        question: "Khi được đề nghị làm việc mới chưa có kinh nghiệm:",
        options: {
            A: {
                text: "Nhận lời ngay để thử thách bản thân",
                trait: "D"
            },
            B: {
                text: "Từ chối vì sợ không làm được",
                trait: "S"
            }
        }
    },
    {
        id: 45,
        question: "Bạn thích không gian sống:",
        options: {
            A: {
                text: "Sang trọng và có nhiều tiện nghi hiện đại",
                trait: "I"
            },
            B: {
                text: "Ấm cúng và gần gũi với thiên nhiên",
                trait: "S"
            }
        }
    },
    {
        id: 46,
        question: "Khi làm việc với dữ liệu hoặc báo cáo, bạn thường:",
        options: {
            A: {
                text: "Xem nhanh các điểm chính rồi đưa ra quyết định",
                trait: "D"
            },
            B: {
                text: "Kiểm tra kỹ từng chi tiết để đảm bảo chính xác",
                trait: "C"
            }
        }
    },
    {
        id: 47,
        question: "Bạn thường đưa ra quyết định dựa trên:",
        options: {
            A: {
                text: "Trực giác và cảm nhận cá nhân",
                trait: "I"
            },
            B: {
                text: "Số liệu và bằng chứng cụ thể",
                trait: "C"
            }
        }
    },
    {
        id: 48,
        question: "Khi tham gia một dự án dài hạn:",
        options: {
            A: {
                text: "Bạn kiên trì theo đuổi đến cùng",
                trait: "S"
            },
            B: {
                text: "Bạn thích tạo bước đột phá để đạt kết quả nhanh",
                trait: "D"
            }
        }
    },
    {
        id: 49,
        question: "Trong nhóm bạn bè, bạn thường là người:",
        options: {
            A: {
                text: "Tạo không khí vui vẻ và kết nối mọi người",
                trait: "I"
            },
            B: {
                text: "Giữ sự ổn định và lắng nghe mọi người",
                trait: "S"
            }
        }
    },
    {
        id: 50,
        question: "Bạn cảm thấy tự tin nhất khi:",
        options: {
            A: {
                text: "Được giao quyền quyết định và chịu trách nhiệm",
                trait: "D"
            },
            B: {
                text: "Được làm việc trong môi trường có quy tắc rõ ràng",
                trait: "C"
            }
        }
    }
];