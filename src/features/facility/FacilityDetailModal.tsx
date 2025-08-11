import React from 'react';
import { useFacilityDetail, useTransports, useUpdateFacility } from '@/lib/api-hooks';
import { Input } from '@/components/ui/input';
import InputDate from '@/components/ui/input-date';
import InputFile from '@/components/ui/input-file';
import { Button } from '@/components/ui/button';
import Select from '@/components/ui/select';
import { uploadSingleFile, saveSingleFile } from '@/lib/api';
import { X } from 'lucide-react';

interface FacilityDetailModalProps {
  open: boolean;
  onClose: () => void;
  facilityId: number | null;
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
const toYYYYMMDD = (str: string) => str?.replace(/-/g, '')

export default function FacilityDetailModal({ open, onClose, facilityId }: FacilityDetailModalProps) {
  const { data: facility, isLoading, error } = useFacilityDetail(facilityId || 0);
  
  // 운수사 목록 조회
  const { data: transportsData } = useTransports(0, 1000); // 전체 목록 조회

  // 설비 수정 mutation
  const updateFacilityMutation = useUpdateFacility();

  // 상태 관리
  const [chargingDevices, setChargingDevices] = React.useState<any[]>([]);
  const [fileUploads, setFileUploads] = React.useState<{[key: string]: any}>({});
  const [fileChanged, setFileChanged] = React.useState<{[key: string]: boolean}>({});
  const [fullAddress, setFullAddress] = React.useState('');
  const [selectedTransportCompanyId, setSelectedTransportCompanyId] = React.useState<string>('');

  // 동적 추가를 위한 상태
  const [dynamicChargingDevices, setDynamicChargingDevices] = React.useState<any[]>([]);
  const [dynamicPowerMeters, setDynamicPowerMeters] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (facility) {
      console.log('🏭 facility 데이터 로드됨:', facility);
      console.log('🏭 chargingDevices:', facility.chargingDevices);
      
      setChargingDevices(facility.chargingDevices || []);
      setFullAddress(facility.fullAddress || '');
      
      // chargingStationId와 transportCompanyId가 일치하므로 그대로 사용
      if (facility.chargingStationId) {
        setSelectedTransportCompanyId(facility.chargingStationId.toString());
      } else {
        // fallback: 기본값 설정
        setSelectedTransportCompanyId('1');
      }
      
      // 동적 상태들 초기화
      setDynamicChargingDevices([]);
      setDynamicPowerMeters([]);
      setFileUploads({});
      setFileChanged({});
    }
  }, [facility]);

  // 모달이 닫힐 때도 동적 상태들 초기화
  React.useEffect(() => {
    if (!open) {
      setDynamicChargingDevices([]);
      setDynamicPowerMeters([]);
      setFileUploads({});
      setFileChanged({});
    }
  }, [open]);

  // chargingDevices 상태 변화 추적
  React.useEffect(() => {
    console.log('🔄 chargingDevices 상태 변경됨:', chargingDevices);
  }, [chargingDevices]);

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

  // 제조번호 변경 핸들러
  const handleSerialNumberChange = (deviceIdx: number, chargerIdx: number | null, value: string) => {
    console.log('🔧 handleSerialNumberChange 호출됨:', { deviceIdx, chargerIdx, value });
    console.log('🔧 현재 chargingDevices:', chargingDevices);
    
    const newDevices = [...chargingDevices];
    if (chargerIdx !== null) {
      // 충전설비 제조번호
      console.log('🔧 충전설비 제조번호 변경:', { 
        before: newDevices[deviceIdx].chargers[chargerIdx].serialNumber,
        after: value 
      });
      newDevices[deviceIdx].chargers[chargerIdx].serialNumber = value;
    } else {
      // AC전력량계 제조번호
      console.log('🔧 AC전력량계 제조번호 변경:', { 
        before: newDevices[deviceIdx].serialNumber,
        after: value 
      });
      newDevices[deviceIdx].serialNumber = value;
    }
    
    console.log('🔧 변경된 newDevices:', newDevices);
    setChargingDevices(newDevices);
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

  // 날짜 변경 핸들러
  const handleDateChange = (deviceIdx: number, chargerIdx: number | null, value: string) => {
    console.log('📅 handleDateChange 호출됨:', { deviceIdx, chargerIdx, value });
    console.log('📅 현재 chargingDevices:', chargingDevices);
    
    const newDevices = [...chargingDevices];
    if (chargerIdx !== null) {
      // 충전설비 제조년월
      const convertedValue = toYYYYMMDD(value);
      console.log('📅 충전설비 제조년월 변경:', { 
        before: newDevices[deviceIdx].chargers[chargerIdx].manufactureDate,
        after: convertedValue,
        originalValue: value
      });
      newDevices[deviceIdx].chargers[chargerIdx].manufactureDate = convertedValue;
    } else {
      // AC전력량계 제조년월
      const convertedValue = toYYYYMMDD(value);
      console.log('📅 AC전력량계 제조년월 변경:', { 
        before: newDevices[deviceIdx].manufactureDate,
        after: convertedValue,
        originalValue: value
      });
      newDevices[deviceIdx].manufactureDate = convertedValue;
    }
    
    console.log('📅 변경된 newDevices:', newDevices);
    setChargingDevices(newDevices);
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

  // 파일 업로드 핸들러
  const handleFileChange = async (deviceIdx: number, chargerIdx: number | null, fileType: string, file: File) => {
    const res = await uploadSingleFile(file);
    const key = `${deviceIdx}_${chargerIdx}_${fileType}`;
    setFileUploads(prev => ({ 
      ...prev, 
      [key]: {
        ...res.data,
        fileType: fileType === 'powerMeter' ? 'AC_POWER_METER' : 'EV_CHARGER'
      }
    }));
    setFileChanged(prev => ({ ...prev, [key]: true }));
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

  // 기존 파일 삭제 핸들러 (JSON에서 완전히 제거)
  const handleExistingFileDelete = (deviceIdx: number, chargerIdx: number | null, fileType: string) => {
    const newDevices = [...chargingDevices];
    if (chargerIdx !== null) {
      // 충전설비 파일 삭제
      newDevices[deviceIdx].chargers[chargerIdx][fileType === 'charger' ? 'chargerFile' : 'powerMeterFile'] = null;
    } else {
      // AC전력량계 파일 삭제
      newDevices[deviceIdx][fileType === 'powerMeter' ? 'powerMeterFile' : 'chargerFile'] = null;
    }
    setChargingDevices(newDevices);
  };

  // 동적 기존 파일 삭제 핸들러
  const handleDynamicExistingFileDelete = (type: 'chargingDevice' | 'powerMeter', deviceIdx: number, chargerIdx: number | null, fileType: string) => {
    if (type === 'chargingDevice') {
      const newDevices = [...dynamicChargingDevices];
      newDevices[deviceIdx][fileType === 'charger' ? 'chargerFile' : 'powerMeterFile'] = null;
      setDynamicChargingDevices(newDevices);
    } else {
      const newPowerMeters = [...dynamicPowerMeters];
      newPowerMeters[deviceIdx][fileType === 'powerMeter' ? 'powerMeterFile' : 'chargerFile'] = null;
      setDynamicPowerMeters(newPowerMeters);
    }
  };

  // 파일 업로드 상태 삭제 핸들러 (새로 업로드한 파일만)
  const handleFileUploadDelete = (deviceIdx: number, chargerIdx: number | null, fileType: string) => {
    const key = `${deviceIdx}_${chargerIdx}_${fileType}`;
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
      // 1. 파일 저장 로직 (saveSingleFile 호출)
      const fileSaveResults: { [key: string]: any } = {};
      for (const [key, upload] of Object.entries(fileUploads)) {
        if (fileChanged[key]) {
          // key 형식: "deviceIdx_chargerIdx_fileType" 또는 "type_deviceIdx_chargerIdx_fileType"
          const keyParts = key.split('_');
          let deviceIdx, chargerIdx, fileType;
          
          if (keyParts.length === 3) {
            // 기존 항목: "deviceIdx_chargerIdx_fileType"
            [deviceIdx, chargerIdx, fileType] = keyParts;
          } else if (keyParts.length === 4) {
            // 동적 항목: "type_deviceIdx_chargerIdx_fileType"
            [, deviceIdx, chargerIdx, fileType] = keyParts;
          }
          
          // FileType 매핑
          let mappedFileType;
          if (fileType === 'powerMeter') {
            mappedFileType = 'AC_POWER_METER';
          } else if (fileType === 'charger') {
            mappedFileType = 'EV_CHARGER';
          }
          
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

      // 2. PowerMeters 배열 구성
      const powerMeters = [];

      // 2-1. 기존 PowerMeter들 처리
      for (let deviceIdx = 0; deviceIdx < chargingDevices.length; deviceIdx++) {
        const device = chargingDevices[deviceIdx];
        
        // PowerMeter 정보 구성
        const powerMeter: any = {
          powerMeterId: device.powerMeterId,
          serialNumber: device.serialNumber,
          manufactureDate: device.manufactureDate,
          chargers: []
        };

        // PowerMeter 파일 처리
        if (device.powerMeterFile) {
          // 기존 파일이 있는 경우
          powerMeter.file = {
            deviceFileId: device.powerMeterFile.deviceFileId,
            deviceId: device.powerMeterId,
            file: {
              uploadDirPath: "device",
              fileType: "AC_POWER_METER",
              originalFileName: device.powerMeterFile.originalFileName,
              storedFileName: device.powerMeterFile.storedFileName,
              uploadTempPath: device.powerMeterFile.uploadTempPath,
              fileSizeByte: device.powerMeterFile.fileSizeByte
            }
          };
        } else if (fileSaveResults[`${deviceIdx}_null_powerMeter`]) {
          // 새로 업로드된 파일이 있는 경우
          const savedFile = fileSaveResults[`${deviceIdx}_null_powerMeter`];
          powerMeter.file = {
            deviceFileId: null,
            deviceId: null,
            file: {
              uploadDirPath: "device",
              fileType: "AC_POWER_METER",
              originalFileName: savedFile.originalFileName,
              storedFileName: savedFile.storedFileName,
              uploadTempPath: savedFile.uploadTempPath,
              fileSizeByte: savedFile.fileSizeByte
            }
          };
        }

        // Charger들 처리
        for (let chargerIdx = 0; chargerIdx < (device.chargers?.length || 0); chargerIdx++) {
          const charger = device.chargers[chargerIdx];
          
          const chargerData: any = {
            chargerId: charger.chargerId,
            serialNumber: charger.serialNumber,
            manufactureDate: charger.manufactureDate
          };

          // Charger 파일 처리
          if (charger.chargerFile) {
            // 기존 파일이 있는 경우
            chargerData.file = {
              deviceFileId: charger.chargerFile.deviceFileId,
              deviceId: charger.chargerId,
              file: {
                uploadDirPath: "device",
                fileType: "EV_CHARGER",
                originalFileName: charger.chargerFile.originalFileName,
                storedFileName: charger.chargerFile.storedFileName,
                uploadTempPath: charger.chargerFile.uploadTempPath,
                fileSizeByte: charger.chargerFile.fileSizeByte
              }
            };
          } else if (fileSaveResults[`${deviceIdx}_${chargerIdx}_charger`]) {
            // 새로 업로드된 파일이 있는 경우
            const savedFile = fileSaveResults[`${deviceIdx}_${chargerIdx}_charger`];
            chargerData.file = {
              deviceFileId: null,
              deviceId: null,
              file: {
                uploadDirPath: "device",
                fileType: "EV_CHARGER",
                originalFileName: savedFile.originalFileName,
                storedFileName: savedFile.storedFileName,
                uploadTempPath: savedFile.uploadTempPath,
                fileSizeByte: savedFile.fileSizeByte
              }
            };
          }

          powerMeter.chargers.push(chargerData);
        }

        powerMeters.push(powerMeter);
      }

      // 2-2. 동적 추가된 PowerMeter들 처리
      for (let deviceIdx = 0; deviceIdx < dynamicPowerMeters.length; deviceIdx++) {
        const device = dynamicPowerMeters[deviceIdx];
        
        const powerMeter: any = {
          powerMeterId: null, // 동적 추가는 null
          serialNumber: device.serialNumber,
          manufactureDate: device.manufactureDate,
          chargers: []
        };

        // PowerMeter 파일 처리
        if (fileSaveResults[`powerMeter_${deviceIdx}_null_powerMeter`]) {
          const savedFile = fileSaveResults[`powerMeter_${deviceIdx}_null_powerMeter`];
          powerMeter.file = {
            deviceFileId: null,
            deviceId: null,
            file: {
              uploadDirPath: "device",
              fileType: "AC_POWER_METER",
              originalFileName: savedFile.originalFileName,
              storedFileName: savedFile.storedFileName,
              uploadTempPath: savedFile.uploadTempPath,
              fileSizeByte: savedFile.fileSizeByte
            }
          };
        }

        // 동적 PowerMeter의 chargers는 빈 배열 (현재 구조상)
        powerMeters.push(powerMeter);
      }

      // 2-3. 동적 추가된 Charger들을 기존 PowerMeter에 추가
      // (첫 번째 PowerMeter에 추가하는 것으로 가정)
      if (powerMeters.length > 0 && dynamicChargingDevices.length > 0) {
        for (let deviceIdx = 0; deviceIdx < dynamicChargingDevices.length; deviceIdx++) {
          const device = dynamicChargingDevices[deviceIdx];
          
          const chargerData: any = {
            chargerId: null, // 동적 추가는 null
            serialNumber: device.serialNumber,
            manufactureDate: device.manufactureDate
          };

          // Charger 파일 처리
          if (fileSaveResults[`chargingDevice_${deviceIdx}_null_charger`]) {
            const savedFile = fileSaveResults[`chargingDevice_${deviceIdx}_null_charger`];
            chargerData.file = {
              deviceFileId: null,
              deviceId: null,
              file: {
                uploadDirPath: "device",
                fileType: "EV_CHARGER",
                originalFileName: savedFile.originalFileName,
                storedFileName: savedFile.storedFileName,
                uploadTempPath: savedFile.uploadTempPath,
                fileSizeByte: savedFile.fileSizeByte
              }
            };
          }

          powerMeters[0].chargers.push(chargerData);
        }
      }

      // 3. 최종 payload 구성
      const payload = {
        address: fullAddress.split(' ').slice(0, -1).join(' '), // 상세주소 제외
        detailAddress: fullAddress.split(' ').slice(-1).join(' '), // 상세주소만
        powerMeters: powerMeters
      };

      // 4. API 호출
      console.log('설비 정보 업데이트 payload:', payload);
      
      // 실제 API 호출 구현
      if (facilityId) {
        await updateFacilityMutation.mutateAsync({ 
          id: facilityId, 
          data: payload 
        });
        console.log('설비 정보 업데이트 성공');
      }
      
      onClose();
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

  if (!open || !facilityId) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end items-stretch">
        <div className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end items-stretch">
        <div className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-red-500">차고지 정보를 찾을 수 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-stretch">
      {/* BG */}
      <div
        className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-[20px] font-medium text-[#141C25] leading-7 font-inter">설비 상세정보</div>
          <button
            className="p-2 bg-[#F2F4F7] rounded-lg flex items-center justify-center"
            onClick={onClose}
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
          
          {/* AC전력량계 및 충전설비 */}
          {chargingDevices?.map((device: any, deviceIdx: number) => (
            <div key={deviceIdx} className="flex flex-col gap-6">
              {/* AC전력량계 */}
              <div className="flex gap-6">
                <div className="flex-1 flex gap-5">
                  <div className="flex-1">
                    <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">AC전력량계 제조번호</label>
                    <Input 
                      value={device.serialNumber} 
                      onChange={(e) => handleSerialNumberChange(deviceIdx, null, e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">제조년월</label>
                    <InputDate 
                      type="month"
                      value={toDashDate(device.manufactureDate || '')} 
                      onChange={(e) => handleDateChange(deviceIdx, null, e.target.value)} 
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <InputFile
                    label="AC전력량계 이미지"
                    value={device.powerMeterFile ? { name: device.powerMeterFile.originalFileName } : 
                           fileUploads[`${deviceIdx}_null_powerMeter`] ? { name: fileUploads[`${deviceIdx}_null_powerMeter`].originalFileName } : null}
                    onChange={(file) => handleFileChange(deviceIdx, null, 'powerMeter', file)}
                    onDelete={() => device.powerMeterFile ? 
                      handleExistingFileDelete(deviceIdx, null, 'powerMeter') : 
                      handleFileUploadDelete(deviceIdx, null, 'powerMeter')}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* 충전설비 */}
              {device.chargers?.map((charger: any, chargerIdx: number) => (
                <div className="flex gap-6" key={chargerIdx}>
                  <div className="flex-1 flex gap-5">
                    <div className="flex-1">
                      <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">충전설비 제조번호</label>
                      <Input 
                        value={charger.serialNumber} 
                        onChange={(e) => handleSerialNumberChange(deviceIdx, chargerIdx, e.target.value)}
                        className="w-full"
                      />
                    </div>
                                      <div className="flex-1">
                    <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter mb-2 block">충전설비 제조년월</label>
                    <InputDate 
                      type="month"
                      value={toDashDate(charger.manufactureDate || '')} 
                      onChange={(e) => handleDateChange(deviceIdx, chargerIdx, e.target.value)} 
                      className="w-full"
                    />
                  </div>
                  </div>
                  <div className="flex-1">
                    <InputFile
                      label="충전설비동판 이미지"
                      value={charger.chargerFile ? { name: charger.chargerFile.originalFileName } : 
                             fileUploads[`${deviceIdx}_${chargerIdx}_charger`] ? { name: fileUploads[`${deviceIdx}_${chargerIdx}_charger`].originalFileName } : null}
                      onChange={(file) => handleFileChange(deviceIdx, chargerIdx, 'charger', file)}
                      onDelete={() => charger.chargerFile ? 
                        handleExistingFileDelete(deviceIdx, chargerIdx, 'charger') : 
                        handleFileUploadDelete(deviceIdx, chargerIdx, 'charger')}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}

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
          
          {/* 구분선 */}
          <div className="w-full h-0 border-t border-[#e4e7ec]"></div>
          
          {/* AC전력량계 추가 버튼 */}
          <button 
            onClick={handleAddPowerMeter}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]"
          >
            <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
            AC전력량계 추가
          </button>
        </div>
        
        {/* 하단 CTA */}
        <div className="mt-auto pt-6">
          <Button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#141C25] text-white rounded-[10px] font-medium text-[14px] shadow"
          >
            수정
          </Button>
        </div>
      </div>
    </div>
  );
} 