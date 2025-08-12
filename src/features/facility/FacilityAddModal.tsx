import React from 'react';
import { useTransports, useCreateFacility } from '@/lib/api-hooks';
import { Input } from '@/components/ui/input';
import InputDate from '@/components/ui/input-date';
import InputFile from '@/components/ui/input-file';
import { Button } from '@/components/ui/button';
import Select from '@/components/ui/select';
import { uploadSingleFile, saveSingleFile } from '@/lib/api';
import { X } from 'lucide-react';

interface FacilityAddModalProps {
  open: boolean;
  onClose: (shouldRefresh?: boolean) => void;
}

// 날짜 포맷 변환 함수
const toDashDate = (str: string) => {
  if (!str) return '';

  // 6자리 문자열 (yyyymm)을 yyyy-mm으로 변환
  if (str.length === 6) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}`;
  }

  // 8자리 문자열 (yyyymmdd)을 yyyy-mm-dd로 변환
  if (str.length === 8) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  }

  // yyyy-mm 형식이 이미 올바른 경우 그대로 반환
  if (str.match(/^\d{4}-\d{2}$/)) {
    return str;
  }

  return str;
}

const toYYYYMMDD = (str: string) => {
  if (!str) return '';

  // yyyy-mm 형식을 yyyy-mm으로 그대로 반환 (백엔드가 기대하는 형식)
  if (str.match(/^\d{4}-\d{2}$/)) {
    return str;
  }

  // yyyy-mm-dd 형식을 yyyy-mm으로 변환
  if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return str.slice(0, 7); // "2024-02-15" -> "2024-02"
  }

  // yyyymm 형식을 yyyy-mm으로 변환
  if (str.match(/^\d{6}$/)) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}`; // "202402" -> "2024-02"
  }

  // yyyymmdd 형식을 yyyy-mm으로 변환
  if (str.match(/^\d{8}$/)) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}`; // "20240215" -> "2024-02"
  }

  return str;
}

export default function FacilityAddModal({ open, onClose }: FacilityAddModalProps) {
  // 운수사 목록 조회
  const { data: transportsData } = useTransports(0, 1000); // 전체 목록 조회
  
  // 설비 생성 mutation
  const createFacilityMutation = useCreateFacility();

  // 상태 관리
  const [chargingDevices, setChargingDevices] = React.useState<any[]>([]);
  const [fileUploads, setFileUploads] = React.useState<{[key: string]: any}>({});
  const [fileChanged, setFileChanged] = React.useState<{[key: string]: boolean}>({});
  const [fullAddress, setFullAddress] = React.useState('');
  const [selectedTransportCompanyId, setSelectedTransportCompanyId] = React.useState<string>('');

  // 동적 추가를 위한 상태
  const [dynamicChargingDevices, setDynamicChargingDevices] = React.useState<any[]>([]);
  const [dynamicPowerMeters, setDynamicPowerMeters] = React.useState<any[]>([]);

  // 모달이 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!open) {
      setChargingDevices([]);
      setDynamicChargingDevices([]);
      setDynamicPowerMeters([]);
      setFileUploads({});
      setFileChanged({});
      setFullAddress('');
      setSelectedTransportCompanyId('');
    }
  }, [open]);

  // 충전설비 추가 핸들러
  const handleAddChargingDevice = () => {
    const newChargingDevice = {
      chargerId: Date.now(), // 임시 ID
      serialNumber: '',
      manufactureDate: '',
      chargerFile: null
    };
    setDynamicChargingDevices(prev => [newChargingDevice, ...prev]);
  };

  // AC전력량계 추가 핸들러
  const handleAddPowerMeter = () => {
    const newPowerMeter = {
      powerMeterId: Date.now(), // 임시 ID
      serialNumber: '',
      manufactureDate: '',
      powerMeterFile: null,
      chargers: []
    };
    setDynamicPowerMeters(prev => [newPowerMeter, ...prev]);
  };

  // 동적 충전설비 제거 핸들러
  const handleRemoveDynamicChargingDevice = (index: number) => {
    setDynamicChargingDevices(prev => prev.filter((_, i) => i !== index));
  };

  // 동적 AC전력량계 제거 핸들러
  const handleRemoveDynamicPowerMeter = (index: number) => {
    setDynamicPowerMeters(prev => prev.filter((_, i) => i !== index));
  };

  // 차고지 주소 변경 핸들러
  const handleAddressChange = (value: string) => {
    setFullAddress(value);
  };

  // 운수사 변경 핸들러
  const handleTransportCompanyChange = (value: string) => {
    setSelectedTransportCompanyId(value);
  };

  // 동적 제조번호 변경 핸들러
  const handleDynamicSerialNumberChange = (type: 'chargingDevice' | 'powerMeter', deviceIdx: number, chargerIdx: number | null, value: string) => {
    if (type === 'chargingDevice') {
      const newDevices = [...dynamicChargingDevices];
      if (chargerIdx !== null) {
        // 충전설비 제조번호
        newDevices[deviceIdx].serialNumber = value;
      } else {
        // AC전력량계 제조번호
        newDevices[deviceIdx].serialNumber = value;
      }
      setDynamicChargingDevices(newDevices);
    } else {
      const newPowerMeters = [...dynamicPowerMeters];
      newPowerMeters[deviceIdx].serialNumber = value;
      setDynamicPowerMeters(newPowerMeters);
    }
  };

  // 동적 날짜 변경 핸들러
  const handleDynamicDateChange = (type: 'chargingDevice' | 'powerMeter', deviceIdx: number, chargerIdx: number | null, value: string) => {
    if (type === 'chargingDevice') {
      const newDevices = [...dynamicChargingDevices];
      if (chargerIdx !== null) {
        // 충전설비 제조년월
        newDevices[deviceIdx].manufactureDate = toYYYYMMDD(value);
      } else {
        // AC전력량계 제조년월
        newDevices[deviceIdx].manufactureDate = toYYYYMMDD(value);
      }
      setDynamicChargingDevices(newDevices);
    } else {
      const newPowerMeters = [...dynamicPowerMeters];
      newPowerMeters[deviceIdx].manufactureDate = toYYYYMMDD(value);
      setDynamicPowerMeters(newPowerMeters);
    }
  };

  // 동적 파일 업로드 핸들러
  const handleDynamicFileChange = async (type: 'chargingDevice' | 'powerMeter', deviceIdx: number, chargerIdx: number | null, fileType: string, file: File) => {
    const res = await uploadSingleFile(file);
    const key = `${type}_${deviceIdx}_${chargerIdx}_${fileType}`;
    setFileUploads(prev => ({
      ...prev,
      [key]: {
        ...res.data,
        fileType: fileType === 'powerMeter' ? 'AC_POWER_METER' : 'EV_CHARGER'
      }
    }));
    setFileChanged(prev => ({ ...prev, [key]: true }));
  };

  // 동적 파일 업로드 상태 삭제 핸들러
  const handleDynamicFileUploadDelete = (type: 'chargingDevice' | 'powerMeter', deviceIdx: number, chargerIdx: number | null, fileType: string) => {
    const key = `${type}_${deviceIdx}_${chargerIdx}_${fileType}`;
    setFileUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[key];
      return newUploads;
    });
    setFileChanged(prev => {
      const newChanged = { ...prev };
      delete newChanged[key];
      return newChanged;
    });
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      // 0. 기본 validation
      if (!selectedTransportCompanyId || !fullAddress.trim()) {
        console.error('운수사와 차고지 주소는 필수입니다.');
        return;
      }

      if (dynamicPowerMeters.length === 0) {
        console.error('최소 1개의 AC전력량계가 필요합니다.');
        return;
      }

      // 1. 파일 저장 로직 (saveSingleFile 호출)
      const fileSaveResults: { [key: string]: any } = {};
      for (const [key, upload] of Object.entries(fileUploads)) {
        if (fileChanged[key]) {
          // key 형식: "type_deviceIdx_chargerIdx_fileType"
          const [, deviceIdx, chargerIdx, fileType] = key.split('_');

          const res = await saveSingleFile({
            uploadDirPath: 'device',
            ...upload,
          });

          if (res?.data) {
            fileSaveResults[key] = {
              ...res.data,
              // 저장된 파일의 전체 경로 사용 (temp가 아닌 실제 저장된 경로)
              uploadTempPath: res.data.uploadDirPath,
            };
          }
        }
      }

      // 2. PowerMeters 배열 구성 (API 가이드에 맞춰)
      const powerMeters = [];

      // 2-1. 동적 추가된 PowerMeter들 처리
      for (let deviceIdx = 0; deviceIdx < dynamicPowerMeters.length; deviceIdx++) {
        const device = dynamicPowerMeters[deviceIdx];

        const powerMeter: any = {
          serialNumber: device.serialNumber,
          manufactureDate: toYYYYMMDD(device.manufactureDate),
          chargers: []
        };

        // PowerMeter 파일 처리 (API 가이드 구조에 맞춰)
        if (fileSaveResults[`powerMeter_${deviceIdx}_null_powerMeter`]) {
          const savedFile = fileSaveResults[`powerMeter_${deviceIdx}_null_powerMeter`];
          powerMeter.powerMeterFile = {
            uploadDirPath: "device",
            fileType: "AC_POWER_METER",
            originalFileName: savedFile.originalFileName,
            storedFileName: savedFile.storedFileName,
            uploadTempPath: savedFile.uploadTempPath,
            fileSizeByte: savedFile.fileSizeByte
          };
        }

        // 2-2. 해당 PowerMeter의 chargers 처리
        for (let chargerIdx = 0; chargerIdx < dynamicChargingDevices.length; chargerIdx++) {
          const charger = dynamicChargingDevices[chargerIdx];

          const chargerData: any = {
            deviceType: "EV_CHARGER",
            serialNumber: charger.serialNumber,
            manufactureDate: toYYYYMMDD(charger.manufactureDate)
          };

          // Charger 파일 처리 (API 가이드 구조에 맞춰)
          if (fileSaveResults[`chargingDevice_${chargerIdx}_null_charger`]) {
            const savedFile = fileSaveResults[`chargingDevice_${chargerIdx}_null_charger`];
            chargerData.chargerFile = {
              uploadDirPath: "device",
              fileType: "EV_CHARGER",
              originalFileName: savedFile.originalFileName,
              storedFileName: savedFile.storedFileName,
              uploadTempPath: savedFile.uploadTempPath,
              fileSizeByte: savedFile.fileSizeByte
            };
          }

          powerMeter.chargers.push(chargerData);
        }

        powerMeters.push(powerMeter);
      }

      // 3. 최종 payload 구성 (API 가이드에 맞춰)
      const payload = {
        address: fullAddress.split(' ').slice(0, -1).join(' '), // 상세주소 제외
        detailAddress: fullAddress.split(' ').slice(-1).join(' '), // 상세주소만
        powerMeters: powerMeters
      };

      // 4. API 호출
      console.log('설비 추가 payload:', payload);

      // 실제 설비 추가 API 호출
      await createFacilityMutation.mutateAsync({
        transportCompanyId: parseInt(selectedTransportCompanyId),
        data: payload
      });
      console.log('설비 추가 성공');
      onClose(true); // 설비 추가 성공 시 리스트 새로고침
    } catch (error) {
      console.error('저장 실패:', error);
      // TODO: 에러 처리 (토스트 메시지 등)
    }
  };

  // 운수사 옵션 생성
  const transportOptions = transportsData?.data?.content?.map((transport: any) => ({
    value: transport.transportCompanyId.toString(),
    label: transport.companyName,
  })) || [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BG */}
             <div
         className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity"
         onClick={() => onClose()}
       />
      {/* Modal */}
      <div className="relative w-[800px] max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-[20px] font-medium text-[#141C25] leading-7 font-inter">시설 추가</div>
                     <button
             className="p-2 bg-[#F2F4F7] rounded-lg flex items-center justify-center"
             onClick={() => onClose()}
             aria-label="닫기"
           >
            <X className="w-4 h-4 text-[#141C25]" />
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-6">
          {/* 차고지/운수사 */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">차고지</label>
              <Input
                value={fullAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="w-full"
                placeholder="차고지 주소를 입력하세요"
              />
            </div>
            <div className="flex-1 h-16">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">운수사</label>
              <Select
                options={transportOptions}
                value={selectedTransportCompanyId}
                onValueChange={handleTransportCompanyChange}
                placeholder="운수사 선택"
              />
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-full h-0 border-t border-[#e4e7ec]"></div>

                     {/* 동적으로 추가된 AC전력량계들 */}
           {dynamicPowerMeters.map((device: any, deviceIdx: number) => (
             <div key={`dynamic-power-${deviceIdx}`} className="flex flex-col gap-6">
               {/* 삭제 버튼 */}
               <div className="flex justify-end">
                 <button
                   onClick={() => handleRemoveDynamicPowerMeter(deviceIdx)}
                   className="text-red-500 text-sm hover:text-red-700"
                 >
                   삭제
                 </button>
               </div>

               {/* AC전력량계 */}
               <div className="flex gap-6">
                 <div className="flex-1 flex gap-5">
                   <div className="flex-1">
                     <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">AC전력량계 제조번호</label>
                     <Input
                       value={device.serialNumber}
                       onChange={(e) => handleDynamicSerialNumberChange('powerMeter', deviceIdx, null, e.target.value)}
                       className="w-full"
                       placeholder="제조번호를 입력하세요"
                     />
                   </div>
                   <div className="flex-1">
                     <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">제조년월</label>
                     <InputDate
                       type="month"
                       value={toDashDate(device.manufactureDate || '')}
                       onChange={(e) => handleDynamicDateChange('powerMeter', deviceIdx, null, e.target.value)}
                       className="w-full"
                     />
                   </div>
                 </div>
                 <div className="flex-1">
                   <InputFile
                     label="AC전력량계 이미지"
                     value={fileUploads[`powerMeter_${deviceIdx}_null_powerMeter`] ? { name: fileUploads[`powerMeter_${deviceIdx}_null_powerMeter`].originalFileName } : null}
                     onChange={(file) => handleDynamicFileChange('powerMeter', deviceIdx, null, 'powerMeter', file)}
                     onDelete={() => handleDynamicFileUploadDelete('powerMeter', deviceIdx, null, 'powerMeter')}
                     className="w-full"
                   />
                 </div>
               </div>
             </div>
           ))}

           {/* AC전력량계 추가 버튼 */}
           <button
             onClick={handleAddPowerMeter}
             className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]"
           >
             <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
             AC전력량계 추가
           </button>

           {/* 구분선 */}
           <div className="w-full h-0 border-t border-[#e4e7ec]"></div>

           {/* 동적으로 추가된 충전설비들 */}
           {dynamicChargingDevices.map((device: any, deviceIdx: number) => (
             <div key={`dynamic-charging-${deviceIdx}`} className="flex flex-col gap-6">
               {/* 삭제 버튼 */}
               <div className="flex justify-end">
                 <button
                   onClick={() => handleRemoveDynamicChargingDevice(deviceIdx)}
                   className="text-red-500 text-sm hover:text-red-700"
                 >
                   삭제
                 </button>
               </div>

               {/* 충전설비만 */}
               <div className="flex gap-6">
                 <div className="flex-1 flex gap-5">
                   <div className="flex-1">
                     <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">충전설비 제조번호</label>
                     <Input
                       value={device.serialNumber}
                       onChange={(e) => handleDynamicSerialNumberChange('chargingDevice', deviceIdx, null, e.target.value)}
                       className="w-full"
                       placeholder="제조번호를 입력하세요"
                     />
                   </div>
                   <div className="flex-1">
                     <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">충전설비 제조년월</label>
                     <InputDate
                       type="month"
                       value={toDashDate(device.manufactureDate || '')}
                       onChange={(e) => handleDynamicDateChange('chargingDevice', deviceIdx, null, e.target.value)}
                       className="w-full"
                     />
                   </div>
                 </div>
                 <div className="flex-1">
                   <InputFile
                     label="충전설비동판 이미지"
                     value={fileUploads[`chargingDevice_${deviceIdx}_null_charger`] ? { name: fileUploads[`chargingDevice_${deviceIdx}_null_charger`].originalFileName } : null}
                     onChange={(file) => handleDynamicFileChange('chargingDevice', deviceIdx, null, 'charger', file)}
                     onDelete={() => handleDynamicFileUploadDelete('chargingDevice', deviceIdx, null, 'charger')}
                     className="w-full"
                   />
                 </div>
               </div>
             </div>
           ))}

           {/* 충전설비 추가 버튼 */}
           <button
             onClick={handleAddChargingDevice}
             className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]"
           >
             <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
             충전설비 추가
           </button>
        </div>

        {/* 하단 CTA */}
        <div className="mt-auto pt-6">
          <Button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#141C25] text-white rounded-[10px] font-medium text-[14px] shadow"
          >
            추가
          </Button>
        </div>
      </div>
    </div>
  );
}

