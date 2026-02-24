import { TarotCard } from "./tarot";

export const TAROT_DECK: TarotCard[] = [
    // Major Arcana (đã có - giữ nguyên)
    {
        id: '0', name: 'The Fool', arcana: 'Major',
        meaningUpright: 'Khởi đầu mới, ngây thơ, tự phát, tinh thần tự do',
        meaningReversed: 'Liều lĩnh, bất cẩn, do dự, dại dột',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNGvRmEaQb1XXcOlQFfXbHPCeYEZvSTGd1ww&s',
        description: 'Kẻ khờ đứng bên bờ vực, sẵn sàng cho một cuộc hành trình mới.'
    },
    {
        id: '1', name: 'The Magician', arcana: 'Major',
        meaningUpright: 'Sức mạnh, hành động khéo léo, ý chí, tập trung',
        meaningReversed: 'Thao túng, kế hoạch tồi, tài năng bị lãng phí',
        imageUrl: 'https://tarot.vn/wp-content/uploads/2014/07/1-Magician-icon.png',
        description: 'Bậc thầy của các nguyên tố, biến ý chí thành hiện thực.'
    },
    {
        id: '2', name: 'The High Priestess', arcana: 'Major',
        meaningUpright: 'Trực giác, bí ẩn, tâm linh, tiềm thức',
        meaningReversed: 'Bí mật bị tiết lộ, mất kết nối bản thân, hời hợt',
        imageUrl: 'https://hoctarot.com/wp-content/uploads/2020/01/maj02.jpg',
        description: 'Người giữ chìa khóa của những bí ẩn thiêng liêng.'
    },
    {
        id: '3', name: 'The Empress', arcana: 'Major',
        meaningUpright: 'Nữ tính, vẻ đẹp, thiên nhiên, sự nuôi dưỡng',
        meaningReversed: 'Sự phụ thuộc, ngột ngạt, thiếu sáng tạo',
        imageUrl: 'https://acudenver.com/wp-content/uploads/2024/11/tarotempress.jpg',
        description: 'Đại diện cho đất mẹ và sự phong phú của cuộc sống.'
    },
    {
        id: '4', name: 'The Emperor', arcana: 'Major',
        meaningUpright: 'Quyền lực, cấu trúc, kiểm soát, kỷ luật',
        meaningReversed: 'Chuyên chế, cứng nhắc, thiếu kiểm soát',
        imageUrl: 'https://guutarot.com/wp-content/uploads/2016/09/04.jpg',
        description: 'Biểu tượng của trật tự thế giới và sự bảo vệ.'
    },
    {
        id: '5', name: 'The Hierophant', arcana: 'Major',
        meaningUpright: 'Truyền thống, niềm tin, giáo dục, sự phù hợp',
        meaningReversed: 'Nổi loạn, tự do, thay đổi niềm tin',
        imageUrl: 'https://tarot.vn/wp-content/uploads/2017/09/5-The-Hierophant-After-Tarot.jpg',
        description: 'Người thầy tâm linh và các giá trị truyền thống.'
    },
    {
        id: '6', name: 'The Lovers', arcana: 'Major',
        meaningUpright: 'Tình yêu, hòa hợp, lựa chọn giá trị',
        meaningReversed: 'Mất cân bằng, lựa chọn sai lầm, xung đột',
        imageUrl: 'https://www.astrojyotish.com/images/tarot/the-lovers.jpg',
        description: 'Sự kết hợp linh hồn và những lựa chọn của trái tim.'
    },
    {
        id: '7', name: 'The Chariot', arcana: 'Major',
        meaningUpright: 'Chiến thắng, ý chí, quyết tâm, kiểm soát',
        meaningReversed: 'Thiếu định hướng, mất kiểm soát, gây hấn',
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/575c175722482ea13706dd8a/1488820858134-9V5YLD6X5HSIG4ODVU3L/chariot',
        description: 'Sự tiến lên mạnh mẽ vượt qua mọi trở ngại.'
    },
    {
        id: '8', name: 'Strength', arcana: 'Major',
        meaningUpright: 'Sức mạnh nội tâm, can đảm, kiên nhẫn',
        meaningReversed: 'Tự ti, yếu đuối, thiếu tự chủ',
        imageUrl: 'https://hoctarot.com/wp-content/uploads/2020/01/maj08.jpg',
        description: 'Sức mạnh của sự dịu dàng chế ngự bản năng hoang dã.'
    },
    {
        id: '9', name: 'The Hermit', arcana: 'Major',
        meaningUpright: 'Chiêm nghiệm, tìm kiếm nội tâm, cô độc',
        meaningReversed: 'Cô lập, thu mình quá mức, mất phương hướng',
        imageUrl: 'https://tarot.vn/wp-content/uploads/2015/05/9.-The-Hermit.jpg',
        description: 'Hành trình tìm kiếm ánh sáng tri thức bên trong.'
    },
    {
        id: '10', name: 'Wheel of Fortune', arcana: 'Major',
        meaningUpright: 'May mắn, thay đổi, chu kỳ vận mệnh',
        meaningReversed: 'Xui xẻo, sự phản kháng trước thay đổi',
        imageUrl: 'https://gates-of-light.com/wp-content/uploads/2016/01/tarot-keys-1-29-06-003-wheel-of-fortune-10.jpg',
        description: 'Bánh xe không ngừng quay, mang lại những vận may mới.'
    },
    {
        id: '11', name: 'Justice', arcana: 'Major',
        meaningUpright: 'Công lý, sự thật, nhân quả, trách nhiệm',
        meaningReversed: 'Bất công, dối trá, thiếu trách nhiệm',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/RWS_Tarot_11_Justice.jpg/960px-RWS_Tarot_11_Justice.jpg',
        description: 'Sự cân bằng và minh bạch trong mọi quyết định.'
    },
    {
        id: '12', name: 'The Hanged Man', arcana: 'Major',
        meaningUpright: 'Hy sinh, buông bỏ, góc nhìn mới, trì hoãn',
        meaningReversed: 'Bế tắc, phản kháng, thiếu tiến triển',
        imageUrl: 'https://tarot.vn/wp-content/uploads/2014/07/12-Hanged-Man-icon.png',
        description: 'Sự dừng lại để nhìn nhận cuộc sống từ một góc độ khác.'
    },
    {
        id: '13', name: 'Death', arcana: 'Major',
        meaningUpright: 'Kết thúc, chuyển hóa, buông bỏ quá khứ',
        meaningReversed: 'Trì trệ, sợ hãi thay đổi, bám víu cũ kỹ',
        imageUrl: 'https://miro.medium.com/v2/resize:fit:1400/1*TpsUqkslGtg__duRTNXMhw.jpeg',
        description: 'Sự kết thúc cần thiết để bắt đầu một chương mới.'
    },
    {
        id: '14', name: 'Temperance', arcana: 'Major',
        meaningUpright: 'Cân bằng, điều độ, kiên nhẫn, hòa hợp',
        meaningReversed: 'Mất cân bằng, cực đoan, thiếu kiên nhẫn',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAMnTHJ3U3K34yi1UmPIm1Jiw8RwWo7FX5gA&s',
        description: 'Sự kết hợp hài hòa giữa các yếu tố đối lập.'
    },
    {
        id: '15', name: 'The Devil', arcana: 'Major',
        meaningUpright: 'Ràng buộc, cám dỗ, vật chất, ám ảnh',
        meaningReversed: 'Giải phóng, tự do, vượt qua nỗi sợ',
        imageUrl: 'https://tarot.vn/wp-content/uploads/2015/12/15-Major-Devil.jpg',
        description: 'Những sợi dây vô hình đang trói buộc tiềm năng của bạn.'
    },
    {
        id: '16', name: 'The Tower', arcana: 'Major',
        meaningUpright: 'Thay đổi đột ngột, hỗn loạn, sụp đổ, thức tỉnh',
        meaningReversed: 'Sợ hãi thảm họa, tránh né sự thật, trì hoãn sụp đổ',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
        description: 'Sự sụp đổ của những cấu trúc cũ để xây dựng lại từ nền móng.'
    },
    {
        id: '17', name: 'The Star', arcana: 'Major',
        meaningUpright: 'Hy vọng, niềm tin, đổi mới, tâm linh',
        meaningReversed: 'Mất hy vọng, thiếu tin tưởng, mất phương hướng',
        imageUrl: 'https://moryarty.com/cdn/shop/files/tarot-star-lauron-william-laurence-nude-sky-water-poster-framed-black-aluminium.jpg?v=1761314742&width=1445',
        description: 'Ánh sáng dẫn đường mang lại sự chữa lành.'
    },
    {
        id: '18', name: 'The Moon', arcana: 'Major',
        meaningUpright: 'Ảo giác, lo âu, tiềm thức, trực giác',
        meaningReversed: 'Giải phóng nỗi sợ, hiểu lầm được làm sáng tỏ',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/RWS_Tarot_18_Moon.jpg/960px-RWS_Tarot_18_Moon.jpg',
        description: 'Thế giới của giấc mơ nơi sự thật bị che mờ.'
    },
    {
        id: '19', name: 'The Sun', arcana: 'Major',
        meaningUpright: 'Thành công, hạnh phúc, sức sống, tích cực',
        meaningReversed: 'Thiếu nhiệt huyết, bi quan, thành công bị trì hoãn',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/RWS_Tarot_19_Sun.jpg/250px-RWS_Tarot_19_Sun.jpg',
        description: 'Nguồn năng lượng rực rỡ mang lại niềm vui thuần khiết.'
    },
    {
        id: '20', name: 'Judgement', arcana: 'Major',
        meaningUpright: 'Phán xét, thức tỉnh, sự chuộc lỗi, quyết định',
        meaningReversed: 'Tự nghi ngờ, sợ hãi bị phán xét, trì hoãn quyết định',
        imageUrl: 'https://hoctarot.com/wp-content/uploads/2020/01/maj20.jpg',
        description: 'Tiếng gọi của vũ trụ để đánh giá lại hành trình của mình.'
    },
    {
        id: '21', name: 'The World', arcana: 'Major',
        meaningUpright: 'Hoàn thành, thành tựu, hội nhập, du hành',
        meaningReversed: 'Thiếu sự kết thúc, trì trệ, mục tiêu dở dang',
        imageUrl: 'https://tarot.vn/wp-content/uploads/2014/07/21-World-icon.png',
        description: 'Chu kỳ đã hoàn tất trong sự hòa hợp tuyệt đối.'
    },

    // WANDS (Gậy) - Bộ 14 lá
    {
        id: '22', name: 'Ace of Wands', arcana: 'Minor',
        meaningUpright: 'Mở ra một hướng đi hoàn toàn mới',
        meaningReversed: 'Bạn gặp khó khăn trong việc xác định mục tiêu của bản thân',
        imageUrl: 'http://www.biddytarot.com/cards/ace_wands.jpg', // Thêm URL sau
        description: 'Ngọn lửa sáng tạo bùng cháy, khởi đầu cho những cơ hội mới.'
    },
    {
        id: '23', name: 'Two of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn tiến bộ hơn khi thiết lập được những kế hoạch ngắn, dài hạn',
        meaningReversed: 'Bạn có thể gặp một vài trục trặc bất ngờ',
        imageUrl: 'http://www.biddytarot.com/cards/two_wands.jpg',
        description: 'Nhìn về phía trước, lên kế hoạch cho tương lai.'
    },
    {
        id: '24', name: 'Three of Wands', arcana: 'Minor',
        meaningUpright: 'Mọi thứ đang diễn ra như mong đợi',
        meaningReversed: 'Bạn gặp một vài sự cố và trì hoãn mục tiêu của mình',
        imageUrl: 'http://www.biddytarot.com/cards/three_wands.jpg',
        description: 'Mở rộng tầm nhìn, chờ đợi kết quả từ những nỗ lực.'
    },
    {
        id: '25', name: 'Four of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn đang hạnh phúc, ổn định',
        meaningReversed: 'Bạn đang mắc kẹt trong bầu không khí ngột ngạt',
        imageUrl: 'http://www.biddytarot.com/cards/four_wands.jpg',
        description: 'Lễ kỷ niệm, sự trở về nhà, niềm vui đoàn tụ.'
    },
    {
        id: '26', name: 'Five of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn đang ở giữa những cuộc xung đột, căng thẳng',
        meaningReversed: 'Bạn vượt qua sự giận dữ của bản thân',
        imageUrl: 'http://www.biddytarot.com/cards/five_wands.jpg',
        description: 'Xung đột, cạnh tranh, những ý kiến trái chiều.'
    },
    {
        id: '27', name: 'Six of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn nhận được thành công, chiến thắng và sự công nhận',
        meaningReversed: 'Bạn đang tiêu cực về bản thân',
        imageUrl: 'http://www.biddytarot.com/cards/six_wands.jpg',
        description: 'Chiến thắng, sự công nhận, danh vọng.'
    },
    {
        id: '28', name: 'Seven of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn đang gặp một chút thách thức. Hãy kiên trì, thành công sẽ đến với bạn ngay thôi',
        meaningReversed: 'Bạn đang cảm thấy bất an và dễ bị tổn thương',
        imageUrl: 'http://www.biddytarot.com/cards/seven_wands.jpg',
        description: 'Bảo vệ vị trí của mình, đối mặt với thách thức.'
    },
    {
        id: '29', name: 'Eight of Wands', arcana: 'Minor',
        meaningUpright: 'Các cuộc đấu tranh đã kết thúc',
        meaningReversed: 'Bạn đang phải đối mặt với nhiều trở ngại trong mục tiêu của mình',
        imageUrl: 'http://www.biddytarot.com/cards/eight_wands.jpg',
        description: 'Hành động nhanh chóng, tin tức đến bất ngờ.'
    },
    {
        id: '30', name: 'Nine of Wands', arcana: 'Minor',
        meaningUpright: 'Đừng bỏ cuộc lúc này vì bạn sắp đạt được thành công',
        meaningReversed: 'Bạn do dự trước những cam kết',
        imageUrl: 'http://www.biddytarot.com/cards/nine_wands.jpg',
        description: 'Kiên cường, phòng thủ, những trở ngại cuối cùng.'
    },
    {
        id: '31', name: 'Ten of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn đang gặt gái những phần thưởng sau những cố gắng của bản thân',
        meaningReversed: 'Bạn đang có quá nhiều gánh nặng',
        imageUrl: 'http://www.biddytarot.com/cards/ten_wands.jpg',
        description: 'Gánh nặng trách nhiệm, áp lực công việc.'
    },
    {
        id: '32', name: 'Page of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn đang ôm ấp nhiều dự định và chỉ chờ cơ hội để "bùng nổ"',
        meaningReversed: 'Bạn thiếu quyết đoán về con đường phía trước',
        imageUrl: 'http://www.biddytarot.com/cards/page_wands.jpg',
        description: 'Sự nhiệt huyết, khám phá, tin tức về cơ hội mới.'
    },
    {
        id: '33', name: 'Knight of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn tự tin, sẵn sàng chinh phục cả thế giới',
        meaningReversed: 'Sự mất mát của quyền lực cá nhân vì sử dụng chúng một cách tiêu cực',
        imageUrl: 'http://www.biddytarot.com/cards/knight_wands.jpg',
        description: 'Hành động, đam mê, du lịch, theo đuổi mục tiêu.'
    },
    {
        id: '34', name: 'Queen of Wands', arcana: 'Minor',
        meaningUpright: 'Bạn mạnh mẽ, độc lập, sáng tạo ngay cả khi đối mặt với nghịch cảnh',
        meaningReversed: 'Bạn mất niềm tin vào chính mình và trở nên e dè, sợ sệt',
        imageUrl: 'http://www.biddytarot.com/cards/queen_wands.jpg',
        description: 'Tự tin, thu hút, ấm áp, quyết đoán.'
    },
    {
        id: '35', name: 'King of Wands', arcana: 'Minor',
        meaningUpright: 'Nhắc nhở bạn định hướng cuộc sống với mục đích và tầm nhìn dài hạn',
        meaningReversed: 'Có thể bạn đang có những quyết định vội vàng, bốc đồng',
        imageUrl: 'http://www.biddytarot.com/cards/king_wands.jpg',
        description: 'Lãnh đạo, tầm nhìn, khởi xướng, uy quyền.'
    },

    // PENTACLES (Xu) - Bộ 14 lá
    {
        id: '36', name: 'Ace of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn đang tận hưởng sự sung túc',
        meaningReversed: 'Bạn có thể bỏ lỡ cơ hội vì thiếu tầm nhìn xa',
        imageUrl: 'http://www.biddytarot.com/cards/ace_pentacles.jpg',
        description: 'Khởi đầu mới về tài chính, cơ hội thịnh vượng.'
    },
    {
        id: '37', name: 'Two of Pentacles', arcana: 'Minor',
        meaningUpright: 'Sự khởi đầu của một công việc mới',
        meaningReversed: 'Bạn đang gặp khó khăn trong việc quản lý các hoạt động của mình',
        imageUrl: 'http://www.biddytarot.com/cards/two_pentacles.jpg',
        description: 'Cân bằng nhiều ưu tiên, thích ứng với thay đổi.'
    },
    {
        id: '38', name: 'Three of Pentacles', arcana: 'Minor',
        meaningUpright: 'Sự hoàn thành ban đầu của một mục tiêu hay kế hoạch',
        meaningReversed: 'Sự thiếu tinh thần đồng đội',
        imageUrl: 'http://www.biddytarot.com/cards/three_pentacles.jpg',
        description: 'Làm việc nhóm, học hỏi, xây dựng nền tảng.'
    },
    {
        id: '39', name: 'Four of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn hoàn thành mục tiêu và đạt được nhiều của cải',
        meaningReversed: 'Bạn bị ám ảnh về sự nghèo đói và buộc mình phải chạy theo vật chất',
        imageUrl: 'http://www.biddytarot.com/cards/four_pentacles.jpg',
        description: 'Kiểm soát, ổn định, giữ chặt những gì có.'
    },
    {
        id: '40', name: 'Five of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn gặp khó khăn trong tất cả mọi thứ',
        meaningReversed: 'Chấm dứt thời kỳ khó khăn',
        imageUrl: 'http://www.biddytarot.com/cards/five_pentacles.jpg',
        description: 'Thiếu thốn, khó khăn tài chính, cảm giác bị bỏ rơi.'
    },
    {
        id: '41', name: 'Six of Pentacles', arcana: 'Minor',
        meaningUpright: 'Sự hào phóng về tiền tài, vật chất',
        meaningReversed: 'Hãy cẩn thận về những người bạn cho vay tiền',
        imageUrl: 'http://www.biddytarot.com/cards/six_pentacles.jpg',
        description: 'Cho và nhận, hào phóng, giúp đỡ người khác.'
    },
    {
        id: '42', name: 'Seven of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn đang tận hưởng những thành quả đạt được từ những khó khăn và nỗ lực',
        meaningReversed: 'Bạn có thể không gặt hái những thứ mình đang tìm kiếm',
        imageUrl: 'http://www.biddytarot.com/cards/seven_pentacles.jpg',
        description: 'Kiên nhẫn, đầu tư dài hạn, nhìn lại thành quả.'
    },
    {
        id: '43', name: 'Eight of Pentacles', arcana: 'Minor',
        meaningUpright: 'Dấu hiệu tích cực cho sự khởi đầu mới',
        meaningReversed: 'Sự cầu toàn của bạn có thể trở thành rào cản',
        imageUrl: 'http://www.biddytarot.com/cards/eight_pentacles.jpg',
        description: 'Rèn luyện kỹ năng, làm việc chăm chỉ, chú ý đến chi tiết.'
    },
    {
        id: '44', name: 'Nine of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn đang chạm đến sự tự tin, tự do, tự túc',
        meaningReversed: 'Bạn đang trải qua mất mát vì những quyết định không khôn ngoan',
        imageUrl: 'http://www.biddytarot.com/cards/nine_pentacles.jpg',
        description: 'Tự chủ, sang trọng, tận hưởng thành quả.'
    },
    {
        id: '45', name: 'Ten of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn đạt đến đỉnh cao của sự nghiệp',
        meaningReversed: 'Có thể hôn nhân của bạn vừa tan vỡ',
        imageUrl: 'http://www.biddytarot.com/cards/ten_pentacles.jpg',
        description: 'Gia đình, di sản, sự thịnh vượng lâu dài.'
    },
    {
        id: '46', name: 'Page of Pentacles', arcana: 'Minor',
        meaningUpright: 'Đây là lúc bạn cần hành động, mở rộng công việc làm ăn',
        meaningReversed: 'Bạn đang bị tắc nghẽn do không lập ra kế hoạch từ trước',
        imageUrl: 'http://www.biddytarot.com/cards/page_pentacles.jpg',
        description: 'Cơ hội học hỏi, thực hành, khởi đầu mới về vật chất.'
    },
    {
        id: '47', name: 'Knight of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn sắp nhận một nhiệm vụ quan trọng',
        meaningReversed: 'Bạn khao khát thoát ra khỏi sự nhàm chán',
        imageUrl: 'http://mystichouse.vn/knight-of-pentacles-y-nghia-la-bai-tarot/',
        description: 'Chăm chỉ, trách nhiệm, kiên định, bảo thủ.'
    },
    {
        id: '48', name: 'Queen of Pentacles', arcana: 'Minor',
        meaningUpright: 'Đại diện cho sự yêu thương, chăm sóc',
        meaningReversed: 'Bạn đang lo lắng về tự chủ tài chính',
        imageUrl: 'http://www.biddytarot.com/cards/queen_pentacles.jpg',
        description: 'Nuôi dưỡng, thoải mái, kết nối với thiên nhiên.'
    },
    {
        id: '49', name: 'King of Pentacles', arcana: 'Minor',
        meaningUpright: 'Bạn đã đạt đến đỉnh cao của thành công',
        meaningReversed: 'Có thể bạn đang lạm dụng quyền lực, quyền hạn và kiểm soát',
        imageUrl: 'http://www.biddytarot.com/cards/king_pentacles.jpg',
        description: 'Thành công về tài chính, lãnh đạo, ổn định, an toàn.'
    },

    // SWORDS (Kiếm) - Bộ 14 lá
    {
        id: '50', name: 'Ace of Swords', arcana: 'Minor',
        meaningUpright: 'Đại diện cho một giai đoạn của cái nhìn sâu sắc',
        meaningReversed: 'Bạn đang bắt đầu trở nên hỗn loạn',
        imageUrl: 'http://www.biddytarot.com/cards/ace_swords.jpg',
        description: 'Sự thật, đột phá, tư duy rõ ràng, công lý.'
    },
    {
        id: '51', name: 'Two of Swords', arcana: 'Minor',
        meaningUpright: 'Dường như bạn đang do dự, bế tắc trước vấn đề quan trọng',
        meaningReversed: 'Bạn đang lung lay trước quan điểm của người khác',
        imageUrl: 'http://www.biddytarot.com/cards/two_swords.jpg',
        description: 'Khó khăn trong quyết định, cân bằng hai lựa chọn.'
    },
    {
        id: '52', name: 'Three of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn sắp đối diện với sự buồn bã, chia ly',
        meaningReversed: 'Bạn vừa bình phục sau khi trải qua những đau khổ',
        imageUrl: 'http://www.biddytarot.com/cards/three_swords.jpg',
        description: 'Đau lòng, tổn thương, nỗi buồn.'
    },
    {
        id: '53', name: 'Four of Swords', arcana: 'Minor',
        meaningUpright: 'Thời gian tốt để xây dựng sức mạnh tinh thần',
        meaningReversed: 'Bạn làm việc không ngừng nghỉ mà quên mất cơ thể cần nghỉ ngơi',
        imageUrl: 'http://www.biddytarot.com/cards/four_swords.jpg',
        description: 'Nghỉ ngơi, tĩnh tâm, hồi phục, chuẩn bị.'
    },
    {
        id: '54', name: 'Five of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn đang quá tham vọng',
        meaningReversed: 'Bạn đã sẵn sàng để kết thúc những căng thẳng',
        imageUrl: 'http://www.biddytarot.com/cards/five_swords.jpg',
        description: 'Xung đột, thất bại, chiến thắng rỗng không.'
    },
    {
        id: '55', name: 'Six of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn đang đối diện với những chuyển biến khó khăn',
        meaningReversed: 'Bạn đang cố gắng thoát ra khỏi quá khứ',
        imageUrl: 'http://www.biddytarot.com/cards/six_swords.jpg',
        description: 'Chuyển tiếp, rời khỏi khó khăn, hành trình.'
    },
    {
        id: '56', name: 'Seven of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn đang lén lút, dối lừa',
        meaningReversed: 'Bạn gặp thử thách trong hướng đi mới',
        imageUrl: 'http://www.biddytarot.com/cards/seven_swords.jpg',
        description: 'Lừa dối, chiến thuật, tránh đối đầu.'
    },
    {
        id: '57', name: 'Eight of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn đang mù quáng tin vào nhận định của bản thân',
        meaningReversed: 'Bạn đang dần trở nên cởi mở hơn',
        imageUrl: 'http://www.biddytarot.com/cards/eight_swords.jpg',
        description: 'Tự giới hạn, cảm giác bị mắc kẹt, bất lực.'
    },
    {
        id: '58', name: 'Nine of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn đang hà khắc với chính mình',
        meaningReversed: 'Bạn đang lo âu quá mức',
        imageUrl: 'http://www.biddytarot.com/cards/nine_swords.jpg',
        description: 'Lo lắng, sợ hãi, ác mộng, mất ngủ.'
    },
    {
        id: '59', name: 'Ten of Swords', arcana: 'Minor',
        meaningUpright: 'Bạn sẽ thoát khỏi vực thẳm và rút ra được bài học đắt giá',
        meaningReversed: 'Kết thúc tình trạng tồi tệ',
        imageUrl: 'http://www.biddytarot.com/cards/ten_swords.jpg',
        description: 'Kết thúc đau đớn, sụp đổ, khởi đầu mới từ đống đổ nát.'
    },
    {
        id: '60', name: 'Page of Swords', arcana: 'Minor',
        meaningUpright: 'Phản ánh niềm đam mê, năng động, nhiệt huyết',
        meaningReversed: 'Bạn đang hành động vội vàng',
        imageUrl: 'http://www.biddytarot.com/cards/page_swords.jpg',
        description: 'Tò mò, cảnh giác, học hỏi, truyền thông.'
    },
    {
        id: '61', name: 'Knight of Swords', arcana: 'Minor',
        meaningUpright: 'Năng lượng bùng nổ, thúc đẩy bạn tiến về phía trước',
        meaningReversed: 'Bạn có chút thiếu kiên nhẫn, bốc đồng',
        imageUrl: 'http://www.biddytarot.com/cards/knight_swords.jpg',
        description: 'Hành động nhanh chóng, quyết đoán, đôi khi hấp tấp.'
    },
    {
        id: '62', name: 'Queen of Swords', arcana: 'Minor',
        meaningUpright: 'Cần xử lý vấn đề bằng lý trí chứ không phải cảm xúc',
        meaningReversed: 'Bạn nên tập trung hơn vào hướng đi của bản thân',
        imageUrl: 'http://www.biddytarot.com/cards/queen_swords.jpg',
        description: 'Độc lập, thông thái, trung thực, nhìn thấu sự thật.'
    },
    {
        id: '63', name: 'King of Swords', arcana: 'Minor',
        meaningUpright: 'Đây là lúc bạn gạt bỏ cảm xúc, giữ sự khách quan',
        meaningReversed: 'Bạn thiếu định hướng trong thời gian này',
        imageUrl: 'http://www.biddytarot.com/cards/king_swords.jpg',
        description: 'Trí tuệ, lý trí, quyền lực, sự thật và công lý.'
    },

    // CUPS (Cốc) - Bộ 14 lá
    {
        id: '64', name: 'Ace of Cups', arcana: 'Minor',
        meaningUpright: 'Cơ hội cho sự vun đắp, chữa lành',
        meaningReversed: 'Bạn đã kìm nén cảm xúc quá lâu, hãy giải phóng chúng',
        imageUrl: 'http://www.biddytarot.com/cards/ace_cups.jpg',
        description: 'Tình yêu mới, cảm xúc dồi dào, khởi đầu tình cảm.'
    },
    {
        id: '65', name: 'Two of Cups', arcana: 'Minor',
        meaningUpright: 'Nói lên hôn nhân và sự hoà hợp',
        meaningReversed: 'Bạn gặp rắc rối với đối tác hoặc tình yêu',
        imageUrl: 'http://www.biddytarot.com/cards/two_cups.jpg',
        description: 'Kết nối, tình bạn, tình yêu đôi lứa, hợp tác.'
    },
    {
        id: '66', name: 'Three of Cups', arcana: 'Minor',
        meaningUpright: 'Khoảng thời gian hài hoà với đồng nghiệp, bạn bè',
        meaningReversed: 'Ám chỉ sự đổ vỡ trong tình yêu',
        imageUrl: 'http://www.biddytarot.com/cards/three_cups.jpg',
        description: 'Ăn mừng, tình bạn, niềm vui tập thể.'
    },
    {
        id: '67', name: 'Four of Cups', arcana: 'Minor',
        meaningUpright: 'Bạn đang buồn chán hoặc không hài lòng với hiện tại',
        meaningReversed: 'Bạn bất an, muốn chạy trốn khỏi hiện thực',
        imageUrl: 'http://www.biddytarot.com/cards/four_cups.jpg',
        description: 'Thờ ơ, trầm tư, nhìn lại, cơ hội bị bỏ lỡ.'
    },
    {
        id: '68', name: 'Five of Cups', arcana: 'Minor',
        meaningUpright: 'Có thể bạn sẽ không đạt được kết quả như mong đợi',
        meaningReversed: 'Chấm dứt sự đau khổ, khởi đầu cho tình yêu mới',
        imageUrl: 'http://www.biddytarot.com/cards/five_cups.jpg',
        description: 'Thất vọng, hối tiếc, tập trung vào mất mát.'
    },
    {
        id: '69', name: 'Six of Cups', arcana: 'Minor',
        meaningUpright: 'Bạn nhớ nhung quá khứ, bỏ quên thực tại',
        meaningReversed: 'Bạn đang có những ý tưởng không thực tế',
        imageUrl: 'http://www.biddytarot.com/cards/six_cups.jpg',
        description: 'Hoài niệm, kỷ niệm đẹp, sự ngây thơ.'
    },
    {
        id: '70', name: 'Seven of Cups', arcana: 'Minor',
        meaningUpright: 'Đánh giá lại vấn đề và đưa ra sự lựa chọn đúng đắn',
        meaningReversed: 'Bạn đang lãng phí thời gian để theo đuổi những thứ không thuộc về mình',
        imageUrl: 'http://www.biddytarot.com/cards/seven_cups.jpg',
        description: 'Ảo tưởng, lựa chọn, giấc mơ, viển vông.'
    },
    {
        id: '71', name: 'Eight of Cups', arcana: 'Minor',
        meaningUpright: 'Bạn muốn giải thoát khỏi sự bon chen của cuộc sống',
        meaningReversed: 'Từ bỏ lúc này là quyết định sáng suốt nhất',
        imageUrl: 'http://www.biddytarot.com/cards/eight_cups.jpg',
        description: 'Rời bỏ, tìm kiếm con đường mới, buông bỏ.'
    },
    {
        id: '72', name: 'Nine of Cups', arcana: 'Minor',
        meaningUpright: 'Giai đoạn cuối cùng của sự phát triển',
        meaningReversed: 'Mong muốn của bạn có thể không được như mong đợi',
        imageUrl: 'http://www.biddytarot.com/cards/nine_cups.jpg',
        description: 'Mãn nguyện, ước muốn thành hiện thực, hạnh phúc.'
    },
    {
        id: '73', name: 'Ten of Cups', arcana: 'Minor',
        meaningUpright: 'Bạn đang hạnh phúc trong tình yêu, hôn nhân',
        meaningReversed: 'Có ai đó chen ngang vào một trong số các mối quan hệ của bạn',
        imageUrl: 'http://www.biddytarot.com/cards/ten_cups.jpg',
        description: 'Hạnh phúc gia đình, viên mãn, tình yêu vĩnh cửu.'
    },
    {
        id: '74', name: 'Page of Cups', arcana: 'Minor',
        meaningUpright: 'Khởi đầu cho dự án sáng tạo hoặc liên doanh',
        meaningReversed: 'Sự bùng nổ cực đại về mặt cảm xúc',
        imageUrl: 'http://www.biddytarot.com/cards/page_cups.jpg',
        description: 'Sáng tạo, trực giác, tin tức về tình cảm.'
    },
    {
        id: '75', name: 'Knight of Cups', arcana: 'Minor',
        meaningUpright: 'Sự khôn ngoan giúp bạn vượt qua trở ngại trong cuộc sống',
        meaningReversed: 'Cảm xúc dâng trào đến mức không thể kiểm soát',
        imageUrl: 'http://www.biddytarot.com/cards/knight_cups.jpg',
        description: 'Lãng mạn, lôi cuốn, theo đuổi lý tưởng.'
    },
    {
        id: '76', name: 'Queen of Cups', arcana: 'Minor',
        meaningUpright: 'Bạn cần thông cảm cho hoàn cảnh của mọi người xung quanh',
        meaningReversed: 'Bạn đang bất an, căng thẳng',
        imageUrl: 'http://www.biddytarot.com/cards/queen_cups.jpg',
        description: 'Thấu hiểu, nhạy cảm, chăm sóc, trực giác mạnh.'
    },
    {
        id: '77', name: 'King of Cups', arcana: 'Minor',
        meaningUpright: 'Cảm xúc cân bằng trong tầm kiểm soát',
        meaningReversed: 'Bạn cộc cằn, ủ rũ, cả tin',
        imageUrl: 'http://www.biddytarot.com/cards/king_cups.jpg',
        description: 'Kiểm soát cảm xúc, từ bi, trưởng thành về tình cảm.'
    }
];