import { ReviewType } from '@/types/entities/ReviewType';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { dateFormat } from '@/utils/dateFormat';

import GreyBlock from '@/components/common/GreyBlock';
import { PremiumBadge } from '@/components/common/PremiumBadge';
import { ProfileAvatar } from '@/components/common/ProfileAvatar';
import RatingStars from '@/components/common/RatingStars';
import { CustomText } from '@/components/ui/text/CustomText';

interface ReviewProps {
  review: ReviewType;
  defaultIsExpanded?: boolean;
  index?: number;
  isUserReview?: boolean;
}

export function Review({
  review,
  isUserReview = false,
  defaultIsExpanded = false,
  index = 1,
}: ReviewProps) {
  const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);
  const { colors } = useTheme();
  const { l } = useLanguage();
  const [isLongText, setLongText] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const maxLines = 4;

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (isChecked) return;

    const lines = e.nativeEvent.lines.length;
    if (lines > maxLines) {
      setLongText(true);
    }

    setIsChecked(true);
  };


  return (
    <GreyBlock index={index} className={'gap-1'} px={8} py={10}>
      {/* ЗАГОЛОВОК */}
      <View className={'flex-row gap-3'}>
        <ProfileAvatar
          source={review.author.avatar}
          size={60}
          username={review.author.username}
        />
        <View className={'gap-2 flex-1'}>
          <View className={'flex-row justify-between'}>
            <View className={'flex-row gap-1'}>
              <CustomText
                className={'text-14 font-bold'}
                style={{ color: colors.theme.blue.primary }}
              >
                {review.author.landlordRating}
              </CustomText>
              <CustomText
                className={'text-14'}
                style={{ color: colors.theme.blue.primary }}
              >
                ({review.author.reviewCount})
              </CustomText>
            </View>
            <CustomText
              className={'text-13'}
              style={{ color: colors.theme.grey.dark }}
            >
              {dateFormat(review.createdAt)}
            </CustomText>
          </View>
          <View className="flex-row items-center gap-1.5">
            <CustomText
              className={'text-18 font-medium flex-1'}
              style={{ color: colors.theme.black.primary }}
              numberOfLines={1}
            >
              {review.author.username}
            </CustomText>
            {review.author.isPremium && <PremiumBadge size="medium" />}
          </View>
        </View>
      </View>
      {/* РЕЙТИНГ */}
      <View className={'flex-row gap-4 mt-4'}>
        <CustomText
          className={'text-14 font-bold'}
          style={{ color: colors.theme.blue.primary }}
        >
          {review.rating}
        </CustomText>
        <RatingStars rating={review.rating} />
      </View>
      {/* ТЕЛО */}
      {isUserReview && (
        <CustomText
          style={{ color: colors.theme.blue.primary }}
          className="text-18 font-bold"
        >
          {review.adName}
        </CustomText>
      )}
      <CustomText
        className={'text-13'}
        style={{ color: colors.theme.blue.primary }}
        // ПЕРЕРЕНДЕРЫ после каждого setState внутри onTextLayout (layout feedback loop)
        // главная причина краша - раньше isExpanded напрямую влияло на numberOfLines
        // соответственно после изменения isExpanded сразу происходил перерендер
        // и вызывался onTextLayout снова. При этом до setState(isChecked) не доходит
        // -
        // сейчас напрямую влияет isChecked, который выполняется строго 1 раз
        numberOfLines={isChecked ? (isExpanded ? undefined : maxLines) : undefined}
        onTextLayout={handleTextLayout}
      >
        {review.text}
      </CustomText>
      {isLongText && (
        <View className={'flex-row gap-1'}>
          {/*<CustomText*/}
          {/*  className={'text-13'}*/}
          {/*  style={{ color: colors.theme.blue.primary }}*/}
          {/*>*/}
          {/*  {' '}*/}
          {/*  ...*/}
          {/*</CustomText>*/}
          <Pressable onPress={() => setIsExpanded(prev => !prev)}>
            <CustomText
              className={'text-13 underline font-bold'}
              style={{ color: colors.theme.blue.dark }}
            >
              {isExpanded ? l.btnHide : l.btnReadMore}
            </CustomText>
          </Pressable>
        </View>
      )}
    </GreyBlock>
  );
}

//
// export function Review({
//   review,
//   isUserReview = false,
//   defaultIsExpanded = false,
//   index = 1,
// }: ReviewProps) {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const { colors } = useTheme();
//   const { l } = useLanguage();
//   const [showButton, setShowButton] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//
//   return (
//     <GreyBlock index={index} className={'gap-1'}>
//       {/* ЗАГОЛОВОК */}
//       <View className={'flex-row gap-3'}>
//         <ProfileAvatar
//           source={review.author.avatar?.url}
//           size={60}
//           id={review.author.id}
//         />
//         <View className={'gap-2 flex-1'}>
//           <View className={'flex-row justify-between'}>
//             <View className={'flex-row gap-1'}>
//               <CustomText
//                 className={'text-14 font-bold'}
//                 style={{ color: colors.theme.blue.primary }}
//               >
//                 {review.author.rating}
//               </CustomText>
//               <CustomText
//                 className={'text-14'}
//                 style={{ color: colors.theme.blue.primary }}
//               >
//                 ({review.author.reviewCount})
//               </CustomText>
//             </View>
//             <CustomText
//               className={'text-13'}
//               style={{ color: colors.theme.grey.dark }}
//             >
//               {dateFormat(review.createdAt)}
//             </CustomText>
//           </View>
//           <CustomText
//             className={'text-18 font-medium flex-1'}
//             style={{ color: colors.theme.black.primary }}
//             numberOfLines={1}
//           >
//             {review.author.name}
//           </CustomText>
//         </View>
//       </View>
//       {/* РЕЙТИНГ */}
//       <View className={'flex-row gap-4 mt-4'}>
//         <CustomText
//           className={'text-14 font-bold'}
//           style={{ color: colors.theme.blue.primary }}
//         >
//           {review.rating}
//         </CustomText>
//         <RatingStars rating={review.rating} />
//       </View>
//       {/* ТЕЛО */}
//       {isUserReview && (
//         <CustomText
//           style={{ color: colors.theme.blue.primary }}
//           className="text-18 font-bold"
//         >
//           {review.adName}
//         </CustomText>
//       )}
//       <CustomText
//         // ПЕРЕРЕНДЕРЫ после каждого setState внутри onTextLayout
//         className={'text-13'}
//         style={{ color: colors.theme.blue.primary }}
//         numberOfLines={isExpanded ? 0 : 4}
//         // срабатывает сразу после рендеринга компонента
//         onTextLayout={e => {
//           // КРАШИ из-за динамического ререндеринга
//           // Если текст обрезан (количество строк = лимиту), значит он длинный
//           if (!isChecked) {
//             if (e.nativeEvent.lines.length > 4) {
//               setShowButton(true);
//               if (!defaultIsExpanded) setIsExpanded(defaultIsExpanded);
//             }
//             setIsChecked(true);
//           }
//         }}
//       >
//         {review.text}
//       </CustomText>
//       <Pressable onPress={() => setIsExpanded(!isExpanded)}>
//         <CustomText
//           className={'text-13 underline font-bold'}
//           style={{
//             color: colors.theme.blue.dark,
//             display: showButton ? 'flex' : 'none',
//           }}
//         >
//           {isExpanded ? l.btnHide : l.btnReadMore}
//         </CustomText>
//       </Pressable>
//     </GreyBlock>
//   );
// }

// ----------------

// import { ReviewType } from '@/types/ReviewType';
//
// import { useState } from 'react';
// import { LayoutChangeEvent, Pressable, View } from 'react-native';
//
// import { useLanguage } from '@/hooks/useLanguage';
// import { useTheme } from '@/hooks/useTheme';
//
// import { dateFormat } from '@/utils/dateFormat';
//
// import GreyBlock from '@/components/common/GreyBlock';
// import { ProfileAvatar } from '@/components/common/ProfileAvatar';
// import RatingStars from '@/components/common/RatingStars';
// import { CustomText } from '@/components/ui/text/CustomText';
//
// interface ReviewProps {
//   review: ReviewType;
//   defaultIsExpanded?: boolean;
//   index?: number;
//   isUserReview?: boolean;
// }
//
// export function Review({
//   review,
//   isUserReview = false,
//   defaultIsExpanded = false,
//   index = 1,
// }: ReviewProps) {
//   const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);
//   const { colors } = useTheme();
//   const { l } = useLanguage();
//
//   // const length = review.text.length;
//   // const ShowButton = length > 180;
//   const [showButton, setShowButton] = useState(false);
//   // const [isChecked, setIsChecked] = useState(false);
//
//   const handleTextLayout = (event: LayoutChangeEvent) => {
//     const { height } = event.nativeEvent.layout;
//     // Если высота текста больше 80px (примерно 4 строки)
//     if (height > 80) {
//       setShowButton(true);
//     }
//   };
//
//   return (
//     <GreyBlock index={index} className={'gap-1'}>
//       {/* ЗАГОЛОВОК */}
//       <View className={'flex-row gap-3'}>
//         <ProfileAvatar
//           source={review.author.avatar?.url}
//           size={60}
//           id={review.author.id}
//         />
//         <View className={'gap-2 flex-1'}>
//           <View className={'flex-row justify-between'}>
//             <View className={'flex-row gap-1'}>
//               <CustomText
//                 className={'text-14 font-bold'}
//                 style={{ color: colors.theme.blue.primary }}
//               >
//                 {review.author.rating}
//               </CustomText>
//               <CustomText
//                 className={'text-14'}
//                 style={{ color: colors.theme.blue.primary }}
//               >
//                 ({review.author.reviewCount})
//               </CustomText>
//             </View>
//             <CustomText
//               className={'text-13'}
//               style={{ color: colors.theme.grey.dark }}
//             >
//               {dateFormat(review.createdAt)}
//             </CustomText>
//           </View>
//           <CustomText
//             className={'text-18 font-medium flex-1'}
//             style={{ color: colors.theme.black.primary }}
//             numberOfLines={1}
//           >
//             {review.author.name}
//           </CustomText>
//         </View>
//       </View>
//       {/* РЕЙТИНГ */}
//       <View className={'flex-row gap-4 mt-4'}>
//         <CustomText
//           className={'text-14 font-bold'}
//           style={{ color: colors.theme.blue.primary }}
//         >
//           {review.rating}
//         </CustomText>
//         <RatingStars rating={review.rating} />
//       </View>
//       {/* ТЕЛО */}
//       {isUserReview && (
//         <CustomText
//           style={{ color: colors.theme.blue.primary }}
//           className="text-18 font-bold"
//         >
//           {review.adName}
//         </CustomText>
//       )}
//       <CustomText
//         className={'text-13'}
//         style={{ color: colors.theme.blue.primary }}
//         numberOfLines={showButton && !isExpanded ? 4 : 0}
//         onLayout={!showButton ? handleTextLayout : undefined}
//       >
//         {review.text}
//       </CustomText>
//
//       {/*<CustomText*/}
//       {/*  className={'text-13'}*/}
//       {/*  style={{ color: colors.theme.blue.primary }}*/}
//       {/*  numberOfLines={isExpanded ? 0 : 4}*/}
//       {/*  // срабатывает сразу после рендеринга компонента*/}
//       {/*  onTextLayout={e => {*/}
//       {/*    // КРАШИ из-за динамического ререндеринга*/}
//       {/*    // Если текст обрезан (количество строк = лимиту), значит он длинный*/}
//       {/*    // if (!isChecked) {*/}
//       {/*    if (e.nativeEvent.lines.length > 4) {*/}
//       {/*      setShowButton(true);*/}
//       {/*      // if (!defaultIsExpanded) setIsExpanded(defaultIsExpanded);*/}
//       {/*    }*/}
//       {/*    // setIsChecked(true);*/}
//       {/*    // };*/}
//       {/*  }}*/}
//       {/*>*/}
//       {/*  {review.text}*/}
//       {/*</CustomText>*/}
//       <Pressable onPress={() => setIsExpanded(!isExpanded)}>
//         <CustomText
//           className={'text-13 underline font-bold'}
//           style={{
//             color: colors.theme.blue.dark,
//             display: showButton ? 'flex' : 'none',
//           }}
//         >
//           {isExpanded ? l.btnHide : l.btnReadMore}
//         </CustomText>
//       </Pressable>
//     </GreyBlock>
//   );
// }